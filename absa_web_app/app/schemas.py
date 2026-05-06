from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class SingleReviewRequest(BaseModel):
    text: str = Field(..., min_length=1)
    star_rating: float | None = None
    model_name: str = "XLM-RoBERTa"
    aspect_threshold: float = Field(0.5, ge=0.1, le=0.9)


class AspectPrediction(BaseModel):
    aspect_id: str
    aspect_name: str
    aspect_confidence: float
    sentiment: str
    sentiment_confidence: float
    low_confidence_flag: bool = False


class SingleReviewSummary(BaseModel):
    overall_tendency: str
    business_insight: str


class SingleReviewResponse(BaseModel):
    review: str
    star_rating: float | None = None
    predictions: list[AspectPrediction]
    summary: SingleReviewSummary


class ExportReportRequest(BaseModel):
    meta: dict[str, Any] = {}
    predictions: list[dict[str, Any]] = []
    dashboard: dict[str, Any] = {}
    aspect_analytics: list[dict[str, Any]] = []
    sentiment_analytics: dict[str, Any] = {}
    sqi: dict[str, Any] = {}
    venue_analytics: list[dict[str, Any]] = []
    time_trend: list[dict[str, Any]] = []
    problem_areas: list[dict[str, Any]] = []
    strengths: list[dict[str, Any]] = []
    recommendations: list[dict[str, Any]] = []
