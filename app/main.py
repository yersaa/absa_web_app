from __future__ import annotations

import json
import math
from io import BytesIO
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from .analytics import DEFAULT_SQI_WEIGHTS, export_excel_report, full_analysis
from .model_service import (
    available_models,
    analyze_dataframe,
    analyze_single_review,
    dataframe_to_records,
    get_device,
    infer_columns,
)
from .schemas import ExportReportRequest, SingleReviewRequest, SingleReviewResponse


APP_DIR = Path(__file__).resolve().parent
STATIC_DIR = APP_DIR / "static"

app = FastAPI(
    title="Restaurant Review ABSA Dashboard",
    description="FastAPI backend for local ABSA model inference and managerial dashboard analytics.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


def sanitize_json(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(key): sanitize_json(item) for key, item in value.items()}
    if isinstance(value, list):
        return [sanitize_json(item) for item in value]
    if isinstance(value, tuple):
        return [sanitize_json(item) for item in value]
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        if not math.isfinite(float(value)):
            return None
        return float(value)
    if isinstance(value, (np.bool_,)):
        return bool(value)
    if isinstance(value, float):
        if not math.isfinite(value):
            return None
        return value
    if isinstance(value, (pd.Timestamp,)):
        return None if pd.isna(value) else value.strftime("%Y-%m-%d")
    if pd.isna(value) if not isinstance(value, (str, bytes, bool, type(None))) else False:
        return None
    return value


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "device": get_device(),
        "available_models": available_models(),
    }


@app.post("/api/analyze-single", response_model=SingleReviewResponse)
def api_analyze_single(payload: SingleReviewRequest) -> dict[str, Any]:
    try:
        result = analyze_single_review(
            text=payload.text,
            star_rating=payload.star_rating,
            model_name=payload.model_name,
            threshold=payload.aspect_threshold,
        )
        return sanitize_json(result)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/analyze-file")
async def api_analyze_file(
    file: UploadFile = File(...),
    model_name: str = Form("XLM-RoBERTa"),
    aspect_threshold: float = Form(0.5),
    sqi_weights: str = Form("{}"),
    text_column: str | None = Form(None),
    rating_column: str | None = Form(None),
    venue_column: str | None = Form(None),
    date_column: str | None = Form(None),
    platform_column: str | None = Form(None),
    response_column: str | None = Form(None),
) -> JSONResponse:
    if not file.filename or not file.filename.lower().endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Please upload an .xlsx Excel file.")

    try:
        raw_bytes = await file.read()
        df = pd.read_excel(BytesIO(raw_bytes))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not read Excel file: {exc}") from exc

    if df.empty:
        raise HTTPException(status_code=400, detail="Uploaded Excel file is empty.")

    detected = infer_columns(df)
    if not text_column and not detected.get("text"):
        return JSONResponse(
            status_code=422,
            content={
                "error_code": "missing_text_column",
                "message": "Review text column was not detected. Please select it manually and run analysis again.",
                "columns": [str(col) for col in df.columns],
                "detected_columns": detected,
            },
        )

    try:
        weights = json.loads(sqi_weights) if sqi_weights else DEFAULT_SQI_WEIGHTS
        if not isinstance(weights, dict):
            weights = DEFAULT_SQI_WEIGHTS
    except Exception:
        weights = DEFAULT_SQI_WEIGHTS

    column_overrides = {
        "text": text_column,
        "rating": rating_column,
        "venue": venue_column,
        "date": date_column,
        "platform": platform_column,
        "response": response_column,
    }

    try:
        predictions, selected_columns = analyze_dataframe(
            df=df,
            model_name=model_name,
            threshold=aspect_threshold,
            columns=column_overrides,
        )
        analysis = full_analysis(predictions, weights)
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail={
                "message": str(exc),
                "columns": [str(col) for col in df.columns],
                "detected_columns": detected,
            },
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    response = {
        "meta": {
            "total_reviews": int(predictions["review_id"].nunique()),
            "total_aspect_mentions": int(len(predictions)),
            "model_name": model_name,
            "detected_columns": selected_columns,
            "source_filename": file.filename,
        },
        "predictions": dataframe_to_records(predictions),
        **analysis,
    }
    return JSONResponse(content=sanitize_json(response))


@app.post("/api/export-report")
def api_export_report(payload: ExportReportRequest) -> StreamingResponse:
    analysis = payload.model_dump()
    report_bytes = export_excel_report(analysis)
    return StreamingResponse(
        BytesIO(report_bytes),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=absa_manager_report.xlsx"},
    )
