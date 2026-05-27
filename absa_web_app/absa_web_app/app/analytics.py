from __future__ import annotations

import re
from io import BytesIO
from typing import Any

import numpy as np
import pandas as pd

from .model_service import (
    ASPECT_ID_TO_NAME,
    BUSINESS_RECOMMENDATIONS,
    RESPONSE_TEMPLATES,
    SENTIMENT_SCORE,
    dataframe_to_records,
)


DEFAULT_SQI_WEIGHTS = {
    "Food Quality": 0.25,
    "Staff Service": 0.20,
    "Wait/Speed": 0.15,
    "Order Accuracy": 0.10,
    "Cleanliness/Hygiene": 0.10,
    "Price/Value": 0.10,
    "Ambience": 0.05,
    "Location": 0.05,
}

STOPWORDS = {
    "и", "в", "во", "на", "не", "но", "а", "я", "мы", "вы", "он", "она", "они", "это", "как", "что",
    "очень", "был", "была", "были", "есть", "у", "за", "по", "из", "с", "со", "для", "то", "же",
    "мен", "біз", "сіз", "ол", "және", "бірақ", "өте", "осы", "сол", "бар", "жоқ", "да", "де",
    "the", "and", "or", "to", "of", "in", "on", "for", "with", "is", "was", "were", "very", "not",
}


def normalize_weights(weights: dict[str, float] | None) -> dict[str, float]:
    raw = DEFAULT_SQI_WEIGHTS.copy()
    if weights:
        for key, value in weights.items():
            if key in raw:
                raw[key] = max(float(value), 0.0)
    total = sum(raw.values())
    if total <= 0:
        return DEFAULT_SQI_WEIGHTS.copy()
    return {key: value / total for key, value in raw.items()}


def sqi_label(score: float | None) -> str:
    if score is None or pd.isna(score):
        return "Not available"
    if score < 40:
        return "Critical"
    if score < 60:
        return "Needs Improvement"
    if score < 80:
        return "Good"
    return "Excellent"


def add_scores(predictions: pd.DataFrame) -> pd.DataFrame:
    df = predictions.copy()
    df["sentiment_score"] = df["sentiment"].map(SENTIMENT_SCORE).fillna(60)
    df["aspect_score"] = df["sentiment_score"] * df["sentiment_confidence"].fillna(0)
    return df


def calculate_nps(review_level: pd.DataFrame) -> float | None:
    if "star_rating" not in review_level.columns:
        return None
    ratings = pd.to_numeric(review_level["star_rating"], errors="coerce").dropna()
    if ratings.empty:
        return None
    promoters = (ratings >= 5).mean()
    detractors = (ratings <= 3).mean()
    return float((promoters - detractors) * 100)


def aspect_analytics(predictions: pd.DataFrame) -> pd.DataFrame:
    df = add_scores(predictions)
    rows = []
    for (aspect_id, aspect_name), group in df.groupby(["aspect_id", "aspect_name"], dropna=False):
        total = len(group)
        counts = group["sentiment"].value_counts()
        rows.append(
            {
                "aspect_id": aspect_id,
                "aspect_name": aspect_name,
                "total_mentions": int(total),
                "positive_count": int(counts.get("positive", 0)),
                "neutral_count": int(counts.get("neutral", 0)),
                "negative_count": int(counts.get("negative", 0)),
                "positive_share": float(counts.get("positive", 0) / total) if total else 0.0,
                "neutral_share": float(counts.get("neutral", 0) / total) if total else 0.0,
                "negative_share": float(counts.get("negative", 0) / total) if total else 0.0,
                "average_aspect_confidence": float(group["aspect_confidence"].mean()),
                "average_sentiment_confidence": float(group["sentiment_confidence"].mean()),
                "aspect_sqi": float(group["aspect_score"].mean()),
            }
        )
    result = pd.DataFrame(rows)
    return result.sort_values("total_mentions", ascending=False) if not result.empty else result


def overall_sqi(predictions: pd.DataFrame, weights: dict[str, float] | None = None) -> float | None:
    aspect_df = aspect_analytics(predictions)
    if aspect_df.empty:
        return None
    normalized = normalize_weights(weights)
    present_weight_total = sum(normalized.get(row["aspect_name"], 0.0) for _, row in aspect_df.iterrows())
    if present_weight_total <= 0:
        return float(aspect_df["aspect_sqi"].mean())
    score = 0.0
    for _, row in aspect_df.iterrows():
        score += row["aspect_sqi"] * normalized.get(row["aspect_name"], 0.0) / present_weight_total
    return float(score)


def sentiment_analytics(predictions: pd.DataFrame) -> dict[str, Any]:
    total = len(predictions)
    counts = predictions["sentiment"].value_counts().rename_axis("sentiment").reset_index(name="count")
    counts["share"] = counts["count"] / total if total else 0

    by_aspect = predictions.groupby(["aspect_name", "sentiment"]).size().reset_index(name="count")
    by_rating = pd.DataFrame()
    if "star_rating" in predictions.columns:
        by_rating = (
            predictions.dropna(subset=["star_rating"])
            .groupby(["star_rating", "sentiment"])
            .size()
            .reset_index(name="count")
        )
    by_branch = pd.DataFrame()
    if "venue" in predictions.columns:
        by_branch = predictions.groupby(["venue", "sentiment"]).size().reset_index(name="count")

    return {
        "overall": dataframe_to_records(counts),
        "by_aspect": dataframe_to_records(by_aspect),
        "by_rating": dataframe_to_records(by_rating),
        "by_branch": dataframe_to_records(by_branch),
    }


def sqi_by_group(predictions: pd.DataFrame, group_col: str, weights: dict[str, float] | None = None) -> pd.DataFrame:
    rows = []
    for group_value, group in predictions.groupby(group_col, dropna=False):
        rows.append(
            {
                group_col: group_value,
                "review_count": int(group["review_id"].nunique()),
                "aspect_mentions": int(len(group)),
                "sqi": overall_sqi(group, weights),
            }
        )
    result = pd.DataFrame(rows)
    if not result.empty:
        result["sqi_status"] = result["sqi"].map(sqi_label)
        result = result.sort_values("sqi", ascending=False)
    return result


def monthly_trend(predictions: pd.DataFrame, weights: dict[str, float] | None = None) -> pd.DataFrame:
    if "date_parsed" not in predictions.columns:
        return pd.DataFrame()
    df = predictions.dropna(subset=["date_parsed"]).copy()
    if df.empty:
        return pd.DataFrame()
    df["month"] = pd.to_datetime(df["date_parsed"], errors="coerce").dt.to_period("M").astype(str)
    rows = []
    for month, group in df.groupby("month"):
        review_level = group.drop_duplicates("review_id")
        sentiments = group["sentiment"].value_counts(normalize=True)
        rows.append(
            {
                "month": month,
                "review_count": int(review_level["review_id"].nunique()),
                "average_rating": float(review_level["star_rating"].mean()) if "star_rating" in review_level.columns else None,
                "sqi": overall_sqi(group, weights),
                "positive_share": float(sentiments.get("positive", 0.0)),
                "neutral_share": float(sentiments.get("neutral", 0.0)),
                "negative_share": float(sentiments.get("negative", 0.0)),
                "nps": calculate_nps(review_level),
            }
        )
    return pd.DataFrame(rows).sort_values("month")


def rating_distribution(predictions: pd.DataFrame) -> pd.DataFrame:
    if "star_rating" not in predictions.columns:
        return pd.DataFrame()
    review_level = predictions.drop_duplicates("review_id")
    data = review_level["star_rating"].round().value_counts().rename_axis("rating").reset_index(name="count")
    return data.sort_values("rating")


def aspect_distribution(predictions: pd.DataFrame) -> pd.DataFrame:
    return predictions["aspect_name"].value_counts().rename_axis("aspect_name").reset_index(name="count")


def review_level_predictions(predictions: pd.DataFrame) -> pd.DataFrame:
    rows: list[dict[str, Any]] = []
    optional_columns = [
        "star_rating",
        "venue",
        "date",
        "platform",
        "company_response",
        "has_company_response",
        "address",
    ]
    sentiment_priority = {"negative": 3, "neutral": 2, "positive": 1}

    for review_id, group in predictions.groupby("review_id", dropna=False):
        first = group.iloc[0]
        sentiment_counts = group["sentiment"].value_counts()
        if sentiment_counts.empty:
            dominant_sentiment = "neutral"
        else:
            dominant_sentiment = sorted(
                sentiment_counts.items(),
                key=lambda item: (item[1], sentiment_priority.get(item[0], 0)),
                reverse=True,
            )[0][0]

        row = {
            "review_id": int(review_id),
            "original_review": first.get("original_review"),
            "detected_aspects": ", ".join(group["aspect_name"].dropna().astype(str).unique()),
            "aspect_sentiments": "; ".join(
                f"{item.aspect_name}: {item.sentiment}"
                for item in group[["aspect_name", "sentiment"]].drop_duplicates().itertuples(index=False)
            ),
            "dominant_sentiment": dominant_sentiment,
            "negative_aspects": ", ".join(group.loc[group["sentiment"] == "negative", "aspect_name"].dropna().astype(str).unique()),
            "positive_aspects": ", ".join(group.loc[group["sentiment"] == "positive", "aspect_name"].dropna().astype(str).unique()),
            "aspect_count": int(group["aspect_id"].nunique()),
            "average_aspect_confidence": float(group["aspect_confidence"].mean()),
            "average_sentiment_confidence": float(group["sentiment_confidence"].mean()),
            "low_confidence_flag": bool(group["low_confidence_flag"].fillna(False).any()),
        }
        for column in optional_columns:
            if column in group.columns:
                row[column] = first.get(column)
        rows.append(row)

    result = pd.DataFrame(rows)
    return result.sort_values("review_id") if not result.empty else result


def branch_analytics(predictions: pd.DataFrame, weights: dict[str, float] | None = None) -> pd.DataFrame:
    if "venue" not in predictions.columns:
        return pd.DataFrame()
    rows = []
    for branch, group in predictions.groupby("venue", dropna=False):
        review_level = group.drop_duplicates("review_id")
        aspect_df = aspect_analytics(group)
        most_problem = aspect_df.sort_values("negative_share", ascending=False).iloc[0]["aspect_name"] if not aspect_df.empty else None
        strongest = aspect_df.sort_values("positive_share", ascending=False).iloc[0]["aspect_name"] if not aspect_df.empty else None
        rows.append(
            {
                "branch_name": branch,
                "address": review_level["address"].dropna().iloc[0] if "address" in review_level.columns and review_level["address"].notna().any() else None,
                "average_rating": float(review_level["star_rating"].mean()) if "star_rating" in review_level.columns else None,
                "review_count": int(review_level["review_id"].nunique()),
                "aspect_mentions": int(len(group)),
                "overall_sqi": overall_sqi(group, weights),
                "negative_share": float((group["sentiment"] == "negative").mean()),
                "positive_share": float((group["sentiment"] == "positive").mean()),
                "response_rate": float(review_level["has_company_response"].mean()) if "has_company_response" in review_level.columns else None,
                "nps": calculate_nps(review_level),
                "most_problematic_aspect": most_problem,
                "strongest_aspect": strongest,
            }
        )
    return pd.DataFrame(rows).sort_values("overall_sqi", ascending=False)


def severity(negative_share: float, total_mentions: int) -> str:
    if negative_share >= 0.40 and total_mentions >= 5:
        return "Critical"
    if negative_share >= 0.25 and total_mentions >= 3:
        return "Important"
    if negative_share >= 0.10:
        return "Moderate"
    return "Recommended"


def sample_quote(predictions: pd.DataFrame, aspect_id: str, sentiment: str) -> str | None:
    subset = predictions[(predictions["aspect_id"] == aspect_id) & (predictions["sentiment"] == sentiment)]
    if subset.empty:
        return None
    return str(subset.sort_values("sentiment_confidence", ascending=False).iloc[0]["original_review"])


def problem_areas(predictions: pd.DataFrame) -> pd.DataFrame:
    aspect_df = aspect_analytics(predictions)
    rows = []
    for _, row in aspect_df.iterrows():
        if row["negative_count"] <= 0:
            continue
        aspect_id = row["aspect_id"]
        rows.append(
            {
                "aspect_id": aspect_id,
                "aspect_name": row["aspect_name"],
                "negative_share": row["negative_share"],
                "negative_count": int(row["negative_count"]),
                "total_mentions": int(row["total_mentions"]),
                "priority": severity(row["negative_share"], int(row["total_mentions"])),
                "why_it_matters": f"Negative feedback about {row['aspect_name']} directly affects perceived service quality and repeat visits.",
                "recommendation": BUSINESS_RECOMMENDATIONS.get(aspect_id, ""),
                "sample_quote": sample_quote(predictions, aspect_id, "negative"),
                "response_template": RESPONSE_TEMPLATES.get(aspect_id, ""),
            }
        )
    result = pd.DataFrame(rows)
    return result.sort_values(["negative_share", "negative_count"], ascending=False) if not result.empty else result


def strengths(predictions: pd.DataFrame) -> pd.DataFrame:
    aspect_df = aspect_analytics(predictions)
    rows = []
    for _, row in aspect_df.iterrows():
        if row["positive_count"] <= 0:
            continue
        rows.append(
            {
                "aspect_id": row["aspect_id"],
                "aspect_name": row["aspect_name"],
                "positive_share": row["positive_share"],
                "positive_count": int(row["positive_count"]),
                "total_mentions": int(row["total_mentions"]),
                "sample_quote": sample_quote(predictions, row["aspect_id"], "positive"),
            }
        )
    result = pd.DataFrame(rows)
    return result.sort_values(["positive_share", "positive_count"], ascending=False) if not result.empty else result


def keyword_cloud(predictions: pd.DataFrame, sentiment: str, limit: int = 40) -> list[dict[str, Any]]:
    subset = predictions[predictions["sentiment"] == sentiment]
    text = " ".join(subset["original_review"].dropna().astype(str).tolist()).lower()
    tokens = re.findall(r"[a-zа-яёәіңғүұқөһ]+", text, flags=re.IGNORECASE)
    counts: dict[str, int] = {}
    for token in tokens:
        token = token.lower()
        if len(token) <= 2 or token in STOPWORDS:
            continue
        counts[token] = counts.get(token, 0) + 1
    return [
        {"keyword": keyword, "count": count}
        for keyword, count in sorted(counts.items(), key=lambda item: item[1], reverse=True)[:limit]
    ]


def dashboard_summary(predictions: pd.DataFrame, weights: dict[str, float] | None = None) -> dict[str, Any]:
    review_level = predictions.drop_duplicates("review_id")
    aspect_df = aspect_analytics(predictions)
    sentiments = predictions["sentiment"].value_counts(normalize=True)
    problem = aspect_df.sort_values("negative_share", ascending=False).iloc[0]["aspect_name"] if not aspect_df.empty else None
    strength = aspect_df.sort_values("positive_share", ascending=False).iloc[0]["aspect_name"] if not aspect_df.empty else None
    return {
        "total_reviews": int(review_level["review_id"].nunique()),
        "total_aspect_mentions": int(len(predictions)),
        "average_rating": float(review_level["star_rating"].mean()) if "star_rating" in review_level.columns else None,
        "response_rate": float(review_level["has_company_response"].mean()) if "has_company_response" in review_level.columns else None,
        "nps": calculate_nps(review_level),
        "overall_sqi": overall_sqi(predictions, weights),
        "negative_aspect_share": float(sentiments.get("negative", 0.0)),
        "positive_aspect_share": float(sentiments.get("positive", 0.0)),
        "neutral_aspect_share": float(sentiments.get("neutral", 0.0)),
        "most_problematic_aspect": problem,
        "strongest_aspect": strength,
    }


def full_analysis(predictions: pd.DataFrame, weights: dict[str, float] | None = None) -> dict[str, Any]:
    weights = normalize_weights(weights)
    aspect_df = aspect_analytics(predictions)
    review_df = review_level_predictions(predictions)
    branch_df = branch_analytics(predictions, weights)
    trend_df = monthly_trend(predictions, weights)
    problems_df = problem_areas(predictions)
    strengths_df = strengths(predictions)
    sentiment = sentiment_analytics(predictions)
    sqi_by_aspect = aspect_df[["aspect_id", "aspect_name", "aspect_sqi"]].rename(columns={"aspect_sqi": "sqi"}) if not aspect_df.empty else pd.DataFrame()
    sqi_by_branch = sqi_by_group(predictions, "venue", weights) if "venue" in predictions.columns else pd.DataFrame()

    recommendations = problems_df[
        ["aspect_id", "aspect_name", "priority", "why_it_matters", "recommendation", "sample_quote", "response_template"]
    ] if not problems_df.empty else pd.DataFrame()

    return {
        "dashboard": {
            "summary": dashboard_summary(predictions, weights),
            "rating_distribution": dataframe_to_records(rating_distribution(predictions)),
            "rating_trend": dataframe_to_records(trend_df[["month", "average_rating", "review_count"]] if not trend_df.empty else trend_df),
            "aspect_distribution": dataframe_to_records(aspect_distribution(predictions)),
            "sentiment_distribution": sentiment["overall"],
            "sentiment_by_aspect": sentiment["by_aspect"],
            "top_branches_best": dataframe_to_records(branch_df.head(3)) if not branch_df.empty else [],
            "top_branches_worst": dataframe_to_records(branch_df.tail(3).sort_values("overall_sqi")) if not branch_df.empty else [],
        },
        "review_level": dataframe_to_records(review_df),
        "aspect_analytics": dataframe_to_records(aspect_df),
        "sentiment_analytics": sentiment,
        "sqi": {
            "overall_sqi": dashboard_summary(predictions, weights)["overall_sqi"],
            "status": sqi_label(dashboard_summary(predictions, weights)["overall_sqi"]),
            "weights": weights,
            "by_aspect": dataframe_to_records(sqi_by_aspect),
            "by_branch": dataframe_to_records(sqi_by_branch),
            "trend": dataframe_to_records(trend_df[["month", "sqi"]] if not trend_df.empty else trend_df),
        },
        "venue_analytics": dataframe_to_records(branch_df),
        "time_trend": dataframe_to_records(trend_df),
        "problem_areas": dataframe_to_records(problems_df),
        "strengths": dataframe_to_records(strengths_df),
        "recommendations": dataframe_to_records(recommendations),
        "keyword_clouds": {
            "positive": keyword_cloud(predictions, "positive"),
            "negative": keyword_cloud(predictions, "negative"),
        },
    }


def export_excel_report(analysis: dict[str, Any]) -> bytes:
    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        pd.DataFrame(analysis.get("predictions", [])).to_excel(writer, sheet_name="Predictions", index=False)
        if analysis.get("review_level"):
            pd.DataFrame(analysis.get("review_level", [])).to_excel(writer, sheet_name="Review Summary", index=False)
        pd.DataFrame(analysis.get("aspect_analytics", [])).to_excel(writer, sheet_name="Aspect Analytics", index=False)
        pd.DataFrame(analysis.get("sentiment_analytics", {}).get("overall", [])).to_excel(writer, sheet_name="Sentiment Summary", index=False)
        sqi_rows = [{"metric": "overall_sqi", "value": analysis.get("sqi", {}).get("overall_sqi"), "status": analysis.get("sqi", {}).get("status")}]
        sqi_rows.extend(analysis.get("sqi", {}).get("by_aspect", []))
        pd.DataFrame(sqi_rows).to_excel(writer, sheet_name="SQI Summary", index=False)
        if analysis.get("venue_analytics"):
            pd.DataFrame(analysis["venue_analytics"]).to_excel(writer, sheet_name="Branch Summary", index=False)
        if analysis.get("time_trend"):
            pd.DataFrame(analysis["time_trend"]).to_excel(writer, sheet_name="Time Trend", index=False)
        pd.DataFrame(analysis.get("problem_areas", [])).to_excel(writer, sheet_name="Problem Areas", index=False)
        pd.DataFrame(analysis.get("strengths", [])).to_excel(writer, sheet_name="Strengths", index=False)
        pd.DataFrame(analysis.get("recommendations", [])).to_excel(writer, sheet_name="Recommendations", index=False)
    output.seek(0)
    return output.getvalue()
