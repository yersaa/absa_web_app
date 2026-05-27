from __future__ import annotations

import math
import re
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer


ASPECT_ID_TO_NAME = {
    "FQ": "Food Quality",
    "SS": "Staff Service",
    "OA": "Order Accuracy",
    "CL": "Cleanliness/Hygiene",
    "PV": "Price/Value",
    "WS": "Wait/Speed",
    "AM": "Ambience",
    "LO": "Location",
}

DEFAULT_ASPECT_ID_ORDER = ["FQ", "SS", "OA", "CL", "PV", "WS", "AM", "LO"]

# If predictions look inverted, check this mapping and your training label order.
DEFAULT_SENTIMENT_ID_TO_LABEL = {
    0: "negative",
    1: "neutral",
    2: "positive",
}

SENTIMENT_SCORE = {
    "positive": 100,
    "neutral": 60,
    "negative": 20,
}

MODEL_PATHS = {
    "XLM-RoBERTa": {
        "aspect": "final_model/aspect_model",
        "sentiment": "final_model/sentiment_model",
    },
    "RuBERT": {
        "aspect": "final_model_rubert/aspect_model",
        "sentiment": "final_model_rubert/sentiment_model",
    },
}

BUSINESS_RECOMMENDATIONS = {
    "FQ": "Review menu consistency, freshness, taste, temperature, and portion quality.",
    "SS": "Improve staff training, politeness, communication, and complaint handling.",
    "OA": "Check order assembly, POS communication, packaging, and final order verification.",
    "CL": "Increase cleaning frequency and make hygiene control more visible to customers.",
    "PV": "Review portion-to-price ratio, promotions, and perceived value for money.",
    "WS": "Improve queue management, kitchen preparation speed, and staff scheduling during peak hours.",
    "AM": "Check seating comfort, noise level, lighting, music, and interior atmosphere.",
    "LO": "Improve signage, navigation information, parking information, and delivery zone clarity.",
}

RESPONSE_TEMPLATES = {
    "FQ": "Thank you for sharing your experience. We are sorry that the food quality did not meet your expectations. We will review this with our kitchen team and check consistency, freshness, and serving standards.",
    "SS": "Thank you for your feedback. We are sorry for the service experience you described. We will address this with our team and strengthen staff communication and customer care standards.",
    "OA": "Thank you for letting us know. We apologize for the mistake in your order. We are checking our order assembly and verification process to prevent this from happening again.",
    "CL": "Thank you for your comment. Cleanliness is very important to us, and we are sorry for this experience. We will review cleaning frequency and hygiene control at this branch.",
    "PV": "Thank you for your feedback. We understand your concern about value for money. We will review pricing, portion size, and current offers.",
    "WS": "Thank you for your feedback. We are sorry that your order took longer than expected. We are reviewing our preparation process and staff scheduling during busy hours to improve waiting time.",
    "AM": "Thank you for your feedback. We are sorry that the atmosphere was not comfortable. We will review seating comfort, noise level, lighting, and the general environment.",
    "LO": "Thank you for your feedback. We understand that location and accessibility are important. We will work on clearer navigation information and branch accessibility details.",
}

TEXT_COLUMN_CANDIDATES = ["review", "reviews", "text", "comment", "feedback", "отзыв", "текст", "комментарий", "пікір", "пікірлер"]
RATING_COLUMN_CANDIDATES = ["rating", "stars", "star_rating", "score", "оценка", "рейтинг", "баға"]
VENUE_COLUMN_CANDIDATES = ["venue", "restaurant", "branch", "cafe", "location_name", "restaurant_name", "заведение", "ресторан", "филиал", "нүкте"]
DATE_COLUMN_CANDIDATES = ["date", "created_at", "review_date", "дата", "күні"]
PLATFORM_COLUMN_CANDIDATES = ["platform", "source", "app", "website", "источник", "платформа"]
RESPONSE_COLUMN_CANDIDATES = ["response", "reply", "company_response", "owner_reply", "ответ", "ответ компании"]
ADDRESS_COLUMN_CANDIDATES = ["address", "адрес", "мекенжай"]

MAX_LENGTH = 256
BATCH_SIZE = 16
SENTIMENT_ASPECT_TEMPLATE = "Aspect: {aspect_name}. Review: {text}"

APP_DIR = Path(__file__).resolve().parent
PROJECT_DIR = APP_DIR.parent
REPO_DIR = PROJECT_DIR.parent


@dataclass
class ModelBundle:
    model_name: str
    aspect_path: Path
    sentiment_path: Path
    device: torch.device
    aspect_tokenizer: Any
    aspect_model: Any
    sentiment_tokenizer: Any
    sentiment_model: Any
    aspect_id_by_index: dict[int, str]
    sentiment_label_by_index: dict[int, str]


_MODEL_CACHE: dict[str, ModelBundle] = {}
_MODEL_LOCK = threading.Lock()


def get_device() -> str:
    return "cuda" if torch.cuda.is_available() else "cpu"


def normalize_column_name(name: str) -> str:
    return "".join(ch for ch in str(name).strip().lower() if ch.isalnum())


def detect_column(columns: list[str], candidates: list[str]) -> str | None:
    normalized = {normalize_column_name(col): col for col in columns}
    for candidate in candidates:
        exact = normalized.get(normalize_column_name(candidate))
        if exact is not None:
            return exact
    for column in columns:
        column_norm = normalize_column_name(column)
        if any(normalize_column_name(candidate) in column_norm for candidate in candidates):
            return column
    return None


def infer_columns(df: pd.DataFrame) -> dict[str, str | None]:
    columns = [str(col) for col in df.columns]
    return {
        "text": detect_column(columns, TEXT_COLUMN_CANDIDATES),
        "rating": detect_column(columns, RATING_COLUMN_CANDIDATES),
        "venue": detect_column(columns, VENUE_COLUMN_CANDIDATES),
        "date": detect_column(columns, DATE_COLUMN_CANDIDATES),
        "platform": detect_column(columns, PLATFORM_COLUMN_CANDIDATES),
        "response": detect_column(columns, RESPONSE_COLUMN_CANDIDATES),
        "address": detect_column(columns, ADDRESS_COLUMN_CANDIDATES),
    }


def clean_review_text(text: Any) -> str:
    try:
        if pd.isna(text):
            return ""
    except Exception:
        pass
    return " ".join(str(text).replace("\u00a0", " ").split())


def resolve_model_path(path_value: str | Path) -> Path:
    raw = Path(path_value)
    candidates = [
        raw,
        Path.cwd() / raw,
        Path.cwd() / "models" / raw,
        PROJECT_DIR / raw,
        PROJECT_DIR / "models" / raw,
        REPO_DIR / raw,
        REPO_DIR / "models" / raw,
    ]
    for candidate in candidates:
        if (candidate / "config.json").exists():
            return candidate
    return PROJECT_DIR / raw


def validate_model_path(path: Path) -> None:
    has_config = (path / "config.json").exists()
    has_weights = (path / "model.safetensors").exists() or (path / "pytorch_model.bin").exists()
    if not has_config or not has_weights:
        raise FileNotFoundError(
            f"Model folder is missing or incomplete: {path}. Expected config.json and model.safetensors."
        )


def available_models() -> list[str]:
    ready = []
    for model_name, paths in MODEL_PATHS.items():
        aspect = resolve_model_path(paths["aspect"])
        sentiment = resolve_model_path(paths["sentiment"])
        if (aspect / "config.json").exists() and (sentiment / "config.json").exists():
            ready.append(model_name)
    return ready


def _config_id2label(model: Any) -> dict[int, str]:
    raw = getattr(model.config, "id2label", {}) or {}
    labels: dict[int, str] = {}
    for key, value in raw.items():
        try:
            labels[int(key)] = str(value)
        except Exception:
            continue
    return labels


def resolve_aspect_mapping(model: Any) -> dict[int, str]:
    id2label = _config_id2label(model)
    aspect_name_to_id = {name.lower(): aspect_id for aspect_id, name in ASPECT_ID_TO_NAME.items()}
    mapping = {}
    for idx, fallback_id in enumerate(DEFAULT_ASPECT_ID_ORDER):
        label = id2label.get(idx, "").strip()
        if label.upper() in ASPECT_ID_TO_NAME:
            mapping[idx] = label.upper()
        elif label.lower() in aspect_name_to_id:
            mapping[idx] = aspect_name_to_id[label.lower()]
        else:
            mapping[idx] = fallback_id
    return mapping


def resolve_sentiment_mapping(model: Any) -> dict[int, str]:
    id2label = _config_id2label(model)
    valid = {"positive", "neutral", "negative"}
    size = max(len(DEFAULT_SENTIMENT_ID_TO_LABEL), len(id2label))
    mapping = {}
    for idx in range(size):
        label = id2label.get(idx, "").strip().lower()
        mapping[idx] = label if label in valid else DEFAULT_SENTIMENT_ID_TO_LABEL.get(idx, "neutral")
    return mapping


def _move_model_safely(model: Any, device: torch.device) -> tuple[Any, torch.device]:
    if device.type != "cuda":
        model.to(device)
        return model, device
    try:
        model.half()
        model.to(device)
        return model, device
    except RuntimeError as exc:
        if "out of memory" not in str(exc).lower():
            raise
        torch.cuda.empty_cache()
        fallback = torch.device("cpu")
        model.to(fallback)
        model.float()
        return model, fallback


def load_model_bundle(model_name: str) -> ModelBundle:
    if model_name not in MODEL_PATHS:
        raise ValueError(f"Unknown model '{model_name}'. Choose one of {list(MODEL_PATHS)}.")
    with _MODEL_LOCK:
        if model_name in _MODEL_CACHE:
            return _MODEL_CACHE[model_name]

        paths = MODEL_PATHS[model_name]
        aspect_path = resolve_model_path(paths["aspect"])
        sentiment_path = resolve_model_path(paths["sentiment"])
        validate_model_path(aspect_path)
        validate_model_path(sentiment_path)

        selected_device = torch.device(get_device())
        aspect_tokenizer = AutoTokenizer.from_pretrained(aspect_path, use_fast=True, local_files_only=True)
        aspect_model = AutoModelForSequenceClassification.from_pretrained(aspect_path, local_files_only=True)
        aspect_model, selected_device = _move_model_safely(aspect_model, selected_device)
        aspect_model.eval()

        sentiment_tokenizer = AutoTokenizer.from_pretrained(sentiment_path, use_fast=True, local_files_only=True)
        sentiment_model = AutoModelForSequenceClassification.from_pretrained(sentiment_path, local_files_only=True)
        sentiment_model, selected_device = _move_model_safely(sentiment_model, selected_device)
        if selected_device.type == "cpu":
            aspect_model.to(selected_device)
            sentiment_model.to(selected_device)
            aspect_model.float()
            sentiment_model.float()
        sentiment_model.eval()

        bundle = ModelBundle(
            model_name=model_name,
            aspect_path=aspect_path,
            sentiment_path=sentiment_path,
            device=selected_device,
            aspect_tokenizer=aspect_tokenizer,
            aspect_model=aspect_model,
            sentiment_tokenizer=sentiment_tokenizer,
            sentiment_model=sentiment_model,
            aspect_id_by_index=resolve_aspect_mapping(aspect_model),
            sentiment_label_by_index=resolve_sentiment_mapping(sentiment_model),
        )
        _MODEL_CACHE[model_name] = bundle
        return bundle


def sigmoid(values: np.ndarray) -> np.ndarray:
    return 1 / (1 + np.exp(-values))


def softmax(values: np.ndarray) -> np.ndarray:
    values = values - np.max(values, axis=-1, keepdims=True)
    exp = np.exp(values)
    return exp / exp.sum(axis=-1, keepdims=True)


@torch.no_grad()
def predict_aspects_batch(texts: list[str], model_name: str, threshold: float = 0.5) -> list[list[dict[str, Any]]]:
    bundle = load_model_bundle(model_name)
    output: list[list[dict[str, Any]]] = []
    for start in range(0, len(texts), BATCH_SIZE):
        batch_texts = texts[start : start + BATCH_SIZE]
        encoded = bundle.aspect_tokenizer(
            batch_texts,
            truncation=True,
            padding=True,
            max_length=MAX_LENGTH,
            return_tensors="pt",
        )
        encoded = {key: value.to(bundle.device) for key, value in encoded.items()}
        logits = bundle.aspect_model(**encoded).logits.detach().cpu().numpy()
        probabilities = sigmoid(logits)
        for row_probs in probabilities:
            selected = np.where(row_probs >= threshold)[0].tolist()
            low_confidence = False
            if not selected:
                selected = [int(row_probs.argmax())]
                low_confidence = True
            row = []
            for idx in selected:
                aspect_id = bundle.aspect_id_by_index.get(idx, DEFAULT_ASPECT_ID_ORDER[idx])
                row.append(
                    {
                        "aspect_id": aspect_id,
                        "aspect_name": ASPECT_ID_TO_NAME.get(aspect_id, aspect_id),
                        "aspect_confidence": float(row_probs[idx]),
                        "low_confidence_flag": low_confidence,
                    }
                )
            output.append(sorted(row, key=lambda item: item["aspect_confidence"], reverse=True))
    return output


def predict_aspects(text: str, model_name: str, threshold: float = 0.5) -> list[dict[str, Any]]:
    return predict_aspects_batch([clean_review_text(text)], model_name, threshold)[0]


def build_sentiment_input(text: str, aspect_id: str | None = None, aspect_name: str | None = None) -> str:
    # Current models were trained with aspect-aware text in the project notebook.
    # If a future sentiment model accepts only plain review text, return `text` here instead.
    if aspect_name:
        return SENTIMENT_ASPECT_TEMPLATE.format(aspect_name=aspect_name, text=text)
    return text


@torch.no_grad()
def predict_sentiment_batch(
    texts: list[str],
    model_name: str,
    aspect_ids: list[str | None] | None = None,
    aspect_names: list[str | None] | None = None,
) -> list[dict[str, Any]]:
    bundle = load_model_bundle(model_name)
    aspect_ids = aspect_ids or [None] * len(texts)
    aspect_names = aspect_names or [None] * len(texts)
    model_inputs = [
        build_sentiment_input(text, aspect_id=aspect_id, aspect_name=aspect_name)
        for text, aspect_id, aspect_name in zip(texts, aspect_ids, aspect_names)
    ]
    output = []
    for start in range(0, len(model_inputs), BATCH_SIZE):
        batch_inputs = model_inputs[start : start + BATCH_SIZE]
        encoded = bundle.sentiment_tokenizer(
            batch_inputs,
            truncation=True,
            padding=True,
            max_length=MAX_LENGTH,
            return_tensors="pt",
        )
        encoded = {key: value.to(bundle.device) for key, value in encoded.items()}
        logits = bundle.sentiment_model(**encoded).logits.detach().cpu().numpy()
        probabilities = softmax(logits)
        for row_probs in probabilities:
            idx = int(row_probs.argmax())
            label = bundle.sentiment_label_by_index.get(idx, DEFAULT_SENTIMENT_ID_TO_LABEL.get(idx, "neutral"))
            output.append({"sentiment": label, "sentiment_confidence": float(row_probs[idx])})
    return output


def predict_sentiment(
    text: str,
    model_name: str,
    aspect_id: str | None = None,
    aspect_name: str | None = None,
) -> dict[str, Any]:
    return predict_sentiment_batch([clean_review_text(text)], model_name, [aspect_id], [aspect_name])[0]


def summarize_single_review(predictions: list[dict[str, Any]]) -> dict[str, str]:
    sentiments = {row["sentiment"] for row in predictions}
    if len(sentiments) > 1:
        tendency = "mixed"
    elif sentiments:
        tendency = next(iter(sentiments))
    else:
        tendency = "neutral"

    negatives = [row for row in predictions if row["sentiment"] == "negative"]
    positives = [row for row in predictions if row["sentiment"] == "positive"]
    if negatives and positives:
        top_neg = max(negatives, key=lambda row: row["sentiment_confidence"])
        insight = f"Customers liked some parts of the experience, but {top_neg['aspect_name']} needs attention."
    elif negatives:
        top_neg = max(negatives, key=lambda row: row["sentiment_confidence"])
        insight = f"{top_neg['aspect_name']} is the main risk in this review. {BUSINESS_RECOMMENDATIONS.get(top_neg['aspect_id'], '')}"
    elif positives:
        top_pos = max(positives, key=lambda row: row["sentiment_confidence"])
        insight = f"{top_pos['aspect_name']} is a positive strength in this review."
    else:
        insight = "The review is mostly neutral or uncertain."
    return {"overall_tendency": tendency, "business_insight": insight}


def analyze_single_review(
    text: str,
    star_rating: float | None = None,
    model_name: str = "XLM-RoBERTa",
    threshold: float = 0.5,
) -> dict[str, Any]:
    cleaned = clean_review_text(text)
    aspects = predict_aspects(cleaned, model_name=model_name, threshold=threshold)
    sentiments = predict_sentiment_batch(
        [cleaned] * len(aspects),
        model_name=model_name,
        aspect_ids=[row["aspect_id"] for row in aspects],
        aspect_names=[row["aspect_name"] for row in aspects],
    )
    predictions = [{**aspect, **sentiment} for aspect, sentiment in zip(aspects, sentiments)]
    return {
        "review": text,
        "star_rating": star_rating,
        "predictions": predictions,
        "summary": summarize_single_review(predictions),
    }


def prepare_dataframe(
    df: pd.DataFrame,
    columns: dict[str, str | None],
) -> tuple[pd.DataFrame, dict[str, str | None]]:
    detected = infer_columns(df)
    selected = {**detected, **{key: value for key, value in columns.items() if value}}
    text_col = selected.get("text")
    if not text_col or text_col not in df.columns:
        raise ValueError("Review text column was not detected. Please select the review text column manually.")

    prepared = pd.DataFrame()
    prepared["review_id"] = np.arange(1, len(df) + 1)
    prepared["original_review"] = df[text_col]
    prepared["model_text"] = prepared["original_review"].map(clean_review_text)
    prepared = prepared[prepared["model_text"].str.len() > 0].copy()
    if prepared.empty:
        raise ValueError("No valid reviews remain after removing empty review text rows.")

    def take_optional(output_col: str, source_key: str) -> None:
        source_col = selected.get(source_key)
        if source_col and source_col in df.columns:
            prepared[output_col] = df.loc[prepared.index, source_col]

    take_optional("star_rating", "rating")
    take_optional("venue", "venue")
    take_optional("date", "date")
    take_optional("platform", "platform")
    take_optional("company_response", "response")
    take_optional("address", "address")

    if "star_rating" in prepared.columns:
        prepared["star_rating"] = pd.to_numeric(prepared["star_rating"], errors="coerce")
    if "date" in prepared.columns:
        prepared["date_parsed"] = pd.to_datetime(prepared["date"], errors="coerce")
    if "company_response" in prepared.columns:
        prepared["has_company_response"] = prepared["company_response"].map(clean_review_text).str.len() > 0

    return prepared.reset_index(drop=True), selected


def analyze_dataframe(
    df: pd.DataFrame,
    model_name: str,
    threshold: float,
    columns: dict[str, str | None] | None = None,
) -> tuple[pd.DataFrame, dict[str, str | None]]:
    prepared, detected_columns = prepare_dataframe(df, columns or {})
    texts = prepared["model_text"].tolist()
    aspect_rows = predict_aspects_batch(texts, model_name=model_name, threshold=threshold)

    rows: list[dict[str, Any]] = []
    for review, aspects in zip(prepared.to_dict("records"), aspect_rows):
        for aspect in aspects:
            row = {
                "review_id": int(review["review_id"]),
                "original_review": review["original_review"],
                "aspect_id": aspect["aspect_id"],
                "aspect_name": aspect["aspect_name"],
                "aspect_confidence": aspect["aspect_confidence"],
                "low_confidence_flag": aspect["low_confidence_flag"],
                "model_name": model_name,
            }
            for optional in ["star_rating", "venue", "date", "date_parsed", "platform", "company_response", "has_company_response", "address"]:
                if optional in review and not (isinstance(review[optional], float) and math.isnan(review[optional])):
                    row[optional] = review[optional]
            rows.append(row)

    predictions = pd.DataFrame(rows)
    sentiment_rows = predict_sentiment_batch(
        predictions["original_review"].map(clean_review_text).tolist(),
        model_name=model_name,
        aspect_ids=predictions["aspect_id"].tolist(),
        aspect_names=predictions["aspect_name"].tolist(),
    )
    predictions = pd.concat([predictions.reset_index(drop=True), pd.DataFrame(sentiment_rows)], axis=1)
    return predictions, detected_columns


def dataframe_to_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    cleaned = df.copy()
    for column in cleaned.columns:
        if pd.api.types.is_datetime64_any_dtype(cleaned[column]):
            cleaned[column] = cleaned[column].dt.strftime("%Y-%m-%d")
        elif pd.api.types.is_bool_dtype(cleaned[column]):
            cleaned[column] = cleaned[column].astype(bool)
    cleaned = cleaned.replace({np.nan: None, pd.NaT: None})
    return cleaned.to_dict("records")
