from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st

from absa_inference import load_absa_pipeline, predict_review


DEFAULT_MODEL_DIR = Path("models/final_model")
FALLBACK_MODEL_DIRS = [
    Path("models/final_model"),
    Path("models/final_model_rubert"),
]


def find_default_model_dir() -> Path:
    for candidate in FALLBACK_MODEL_DIRS:
        if (candidate / "config.json").exists():
            return candidate
    return DEFAULT_MODEL_DIR


@st.cache_resource
def get_pipeline(model_dir: str):
    return load_absa_pipeline(model_dir=model_dir, device="auto")


st.set_page_config(page_title="Restaurant ABSA Demo", layout="wide")
st.title("Restaurant Review Aspect-Based Sentiment Analysis")

model_dir = st.sidebar.text_input("Saved model folder", str(find_default_model_dir()))
threshold = st.sidebar.slider(
    "Aspect detection threshold",
    min_value=0.05,
    max_value=0.95,
    value=0.50,
    step=0.05,
)

review_text = st.text_area(
    "Input review",
    value="Еда вкусная, персонал вежливый, но заказ ждали слишком долго.",
    height=120,
)

if st.button("Predict"):
    config_path = Path(model_dir) / "config.json"
    if not Path(model_dir).exists():
        st.error(
            f"Model folder does not exist: {model_dir}. Train the model first in the notebook."
        )
        st.stop()
    if not config_path.exists():
        st.error(
            f"Model config was not found: {config_path}. Select a folder that contains "
            "`config.json`, for example `models/final_model_rubert`, or finish training "
            "the XLM-R model into `models/final_model`."
        )
        st.stop()

    with st.spinner("Loading model and predicting..."):
        pipeline = get_pipeline(model_dir)
        result = predict_review(review_text, pipeline, threshold=threshold)

    st.subheader("Detected Aspects and Sentiment")
    if not result["predictions"]:
        st.info("No aspects detected.")
    else:
        table = pd.DataFrame(result["predictions"])
        display_columns = [
            "aspect_code",
            "aspect_name",
            "aspect_probability",
            "sentiment",
            "sentiment_confidence",
        ]
        st.dataframe(table[display_columns], use_container_width=True)

    with st.expander("Raw prediction JSON"):
        st.json(result)
