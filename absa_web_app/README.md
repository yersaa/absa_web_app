# Restaurant Review ABSA Web Dashboard

Local production-style web application for Aspect-Based Sentiment Analysis of restaurant, cafe, quick-service restaurant, and fast-food reviews.

The system loads existing local Hugging Face models, predicts review aspects and aspect-level sentiment, and turns raw reviews into manager-friendly analytics:

- aspect-based classification results
- sentiment analytics
- Service Quality Index, SQI
- MVP dashboard metrics
- problematic aspects
- positive strengths
- review-level prediction table
- venue / branch analytics when a venue column exists
- time trend analytics when a date column exists
- downloadable CSV and Excel reports

The app supports English, Russian, and Kazakh interface labels. It does not train models.

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
      styles.css        Responsive Apple-style dashboard
      script.js         Fetch API, Canvas charts, tabs, filters, language toggle
  requirements.txt
  README.md
```

The frontend uses plain HTML, CSS, and JavaScript. It does not use Streamlit, Gradio, Dash, React, Vue, Bootstrap, Tailwind, or external chart libraries. Charts are rendered with the native Canvas API.

## Model Folders

Expected paths:

```text
final_model/aspect_model
final_model/sentiment_model
final_model_rubert/aspect_model
final_model_rubert/sentiment_model
```

The code also supports the current project layout:

```text
../models/final_model/aspect_model
../models/final_model/sentiment_model
../models/final_model_rubert/aspect_model
../models/final_model_rubert/sentiment_model
```

Each model folder must contain at least:

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

With the existing virtual environment:

```powershell
..\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Run

From `C:\diploma1\absa_web_app`:

```powershell
uvicorn app.main:app --reload
```

With the existing virtual environment:

```powershell
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000
```

## Expected Excel Format

Upload an `.xlsx` file. Only the review text column is required.

Supported flexible column names:

| Field | Possible names |
|---|---|
| Review text | `review`, `reviews`, `text`, `comment`, `feedback`, `отзыв`, `текст`, `комментарий`, `пікір`, `пікірлер` |
| Star rating | `rating`, `stars`, `star_rating`, `score`, `оценка`, `рейтинг`, `баға` |
| Branch / venue | `venue`, `restaurant`, `branch`, `cafe`, `location_name`, `restaurant_name`, `заведение`, `ресторан`, `филиал`, `нүкте` |
| Date | `date`, `created_at`, `review_date`, `дата`, `күні` |
| Platform | `platform`, `source`, `app`, `website`, `источник`, `платформа` |
| Company response | `response`, `reply`, `company_response`, `owner_reply`, `ответ`, `ответ компании` |

If the review text column is not detected, the frontend shows a manual selector.

## Inference

The backend uses local Hugging Face loading:

```python
AutoTokenizer.from_pretrained(local_path, local_files_only=True)
AutoModelForSequenceClassification.from_pretrained(local_path, local_files_only=True)
```

Models are lazy-loaded once per selected model and cached in memory. CUDA is used when available; otherwise CPU is used.

Aspect detection is multi-label:

```text
sigmoid(logits)
```

Sentiment classification is multi-class:

```text
softmax(logits)
```

Sentiment is predicted per detected aspect. The current code uses an aspect-aware input template:

```text
Aspect: Food Quality. Review: ...
```

If your sentiment model was trained only on plain review text, update `build_sentiment_input()` in `app/model_service.py`.

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

## SQI

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

Aspect SQI is the average aspect score. Overall SQI is a weighted average of aspect SQI values. The browser lets the manager adjust weights, and the backend normalizes them automatically.

## NPS

If star rating exists:

```text
5 stars = promoter
4 stars = passive
1-3 stars = detractor
NPS = %promoters - %detractors
```

NPS is shown overall, by branch, and by month when data is available.

## Exports

The website supports:

- predictions CSV
- filtered predictions CSV
- multi-sheet Excel report

Excel sheets include predictions, review summary, aspect analytics, sentiment summary, SQI summary, branch summary, time trend, problem areas, strengths, and recommendations.

## Troubleshooting

- `Model folder is missing or incomplete`: verify `config.json` and `model.safetensors` exist in the local model folders.
- `Review text column was not detected`: select the text column manually in the browser.
- CUDA out of memory: select RuBERT or let the backend fall back to CPU.
- Predictions look inverted: check `DEFAULT_SENTIMENT_ID_TO_LABEL` in `app/model_service.py`.
- Excel cannot be read: make sure the file is `.xlsx` and not password-protected.
