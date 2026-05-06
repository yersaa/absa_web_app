# Restaurant Review ABSA Web Dashboard

Production-style local web application for Aspect-Based Sentiment Analysis of restaurant, cafe, quick-service restaurant, and fast-food reviews.

The system analyzes Russian, Kazakh, and mixed RU-KZ customer reviews and transforms them into:

- aspect predictions
- aspect-level sentiment
- Service Quality Index
- NPS-like business indicators
- branch analytics
- time trends
- problem areas and strengths
- downloadable CSV and Excel reports

No training is performed by the app. It only loads existing local Hugging Face model folders.

## Architecture

```text
absa_web_app/
  app/
    main.py             FastAPI endpoints
    model_service.py    Local model loading and inference
    analytics.py        SQI, NPS, branch analytics, trends, report export
    schemas.py          Pydantic request/response schemas
    static/
      index.html        Frontend markup
      styles.css        Apple-style responsive dashboard
      script.js         Fetch API, Canvas charts, tabs, filters
  requirements.txt
  README.md
```

The frontend uses plain HTML, CSS, and JavaScript. It does not use Streamlit, Gradio, Dash, React, Vue, Bootstrap, Tailwind, or external chart libraries. Charts are rendered with the native Canvas API.

## Model Folders

The requested paths are:

```text
final_model/aspect_model
final_model/sentiment_model
final_model_rubert/aspect_model
final_model_rubert/sentiment_model
```

The app also supports the current project layout:

```text
../models/final_model/aspect_model
../models/final_model/sentiment_model
../models/final_model_rubert/aspect_model
../models/final_model_rubert/sentiment_model
```

Each model folder must contain:

```text
config.json
model.safetensors
tokenizer_config.json
tokenizer.json
```

## Install

From `C:\diploma1\absa_web_app`:

```powershell
pip install -r requirements.txt
```

If you use the existing virtual environment:

```powershell
..\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Run

From `C:\diploma1\absa_web_app`:

```powershell
uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000
```

With the existing virtual environment:

```powershell
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

## Expected Excel Format

Upload an `.xlsx` file. Only review text is required.

Supported flexible column names:

| Field | Possible names |
|---|---|
| Review text | `review`, `reviews`, `text`, `comment`, `feedback`, `отзыв`, `текст`, `комментарий`, `пікір`, `пікірлер` |
| Star rating | `rating`, `stars`, `star_rating`, `score`, `оценка`, `рейтинг`, `баға` |
| Branch / venue | `venue`, `restaurant`, `branch`, `cafe`, `location_name`, `restaurant_name`, `заведение`, `ресторан`, `филиал`, `нүкте` |
| Date | `date`, `created_at`, `review_date`, `дата`, `күні` |
| Platform | `platform`, `source`, `app`, `website`, `источник`, `платформа` |
| Company response | `response`, `reply`, `company_response`, `owner_reply`, `ответ`, `ответ компании` |

If the review text column is not detected, the backend returns the available columns and the frontend shows a manual selector.

## Inference

The backend uses Hugging Face Transformers:

```python
AutoTokenizer.from_pretrained(local_path, local_files_only=True)
AutoModelForSequenceClassification.from_pretrained(local_path, local_files_only=True)
```

Models are lazy-loaded once per selected model and cached in memory. CUDA is used when available; otherwise CPU is used. The app calls `model.eval()` and uses `torch.no_grad()`.

Aspect detection is multi-label:

```text
sigmoid(logits)
```

All aspects above the selected threshold are returned. If none pass the threshold, the top-1 aspect is returned with `low_confidence_flag=true`.

Sentiment classification is multi-class:

```text
softmax(logits)
```

Sentiment is predicted per detected aspect. The current code uses an aspect-aware input template:

```text
Aspect: Food Quality. Review: ...
```

This is easy to change in `model_service.py`.

## Label Mapping

The app first reads `model.config.id2label`.

Fallback aspect order:

```python
DEFAULT_ASPECT_ID_ORDER = ["FQ", "SS", "OA", "CL", "PV", "WS", "AM", "LO"]
```

Fallback sentiment mapping:

```python
DEFAULT_SENTIMENT_ID_TO_LABEL = {
    0: "negative",
    1: "neutral",
    2: "positive",
}
```

If sentiment predictions look inverted, check your training label order and update `DEFAULT_SENTIMENT_ID_TO_LABEL` in `app/model_service.py`.

## SQI Calculation

Sentiment score:

```text
positive = 100
neutral = 60
negative = 20
```

For every review-aspect row:

```text
aspect_score = sentiment_score * sentiment_confidence
```

Aspect SQI:

```text
average(aspect_score)
```

Overall SQI:

```text
weighted average of aspect SQI values
```

Default weights:

| Aspect | Weight |
|---|---:|
| Food Quality | 0.25 |
| Staff Service | 0.20 |
| Wait/Speed | 0.15 |
| Order Accuracy | 0.10 |
| Cleanliness/Hygiene | 0.10 |
| Price/Value | 0.10 |
| Ambience | 0.05 |
| Location | 0.05 |

The frontend lets the manager adjust weights. Weights are normalized automatically.

SQI interpretation:

| Score | Meaning |
|---|---|
| 0-39 | Critical |
| 40-59 | Needs Improvement |
| 60-79 | Good |
| 80-100 | Excellent |

## NPS Calculation

If star rating exists:

```text
5 stars = promoter
4 stars = passive
1-3 stars = detractor
NPS = %promoters - %detractors
```

NPS is calculated overall, by branch, and by month when data is available.

## Troubleshooting

- `Model folder is missing or incomplete`: verify `model.safetensors` and `config.json` exist in the local model folders.
- `Review text column was not detected`: select the review text column manually in the browser.
- CUDA out of memory: use RuBERT or let the backend fall back to CPU.
- Predictions look inverted: check `DEFAULT_SENTIMENT_ID_TO_LABEL` in `app/model_service.py`.
- Excel cannot be read: make sure the file is `.xlsx` and not password-protected.
