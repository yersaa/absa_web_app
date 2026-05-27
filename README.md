# Restaurant Review ABSA Service Quality Dashboard

This repository contains an Aspect-Based Sentiment Analysis (ABSA) system for restaurant, cafe, and fast-food customer reviews. The project focuses on Russian, Kazakh, and mixed Russian-Kazakh feedback and converts raw review text into service-quality analytics for restaurant managers.

The system has two main parts:

- `absa_train_save_streamlit_model.ipynb` - model training, evaluation, fine-tuning, hyperparameter tuning, diagnostics, and model export.
- `absa_web_app/` - a FastAPI web dashboard that loads saved local Hugging Face models and turns predictions into business analytics.

## Features

- Multi-label aspect detection for:
  - Food Quality
  - Staff Service
  - Wait/Speed
  - Price/Value
  - Cleanliness/Hygiene
  - Order Accuracy
  - Ambience
  - Location
- Aspect-level sentiment classification:
  - positive
  - neutral
  - negative
- Baseline model comparison:
  - rule-based baseline
  - TF-IDF + Logistic Regression
  - TF-IDF + Linear SVM
  - XLM-RoBERTa Large
  - DeepPavlov RuBERT
- XLM-RoBERTa Large fine-tuning with validation-based model selection.
- Optional hyperparameter tuning and early stopping based mainly on validation macro-F1.
- Single-review prediction.
- Excel upload with automatic column detection.
- Managerial analytics:
  - aspect sentiment distribution
  - Service Quality Index (SQI)
  - NPS-like indicators
  - branch comparison
  - strengths and problem areas
  - time trends
  - recommendations and response templates
- Browser dashboard with HTML, CSS, JavaScript, and Canvas charts.
- Interface labels in English, Russian, and Kazakh.
- CSV and multi-sheet Excel export.

## Project Structure

```text
.
+-- absa_train_save_streamlit_model.ipynb
+-- requirements.txt
+-- dataset_reviews.xlsx                 # local dataset, ignored by Git
+-- models/                              # local trained models, ignored by Git
|   +-- final_model/
|   +-- final_model_rubert/
|   +-- diagnostics/
|   +-- xlmr_hyperparameter_tuning/
+-- absa_web_app/
    +-- README.md
    +-- requirements.txt
    +-- app/
        +-- main.py                      # FastAPI endpoints
        +-- model_service.py             # model loading and inference
        +-- analytics.py                 # SQI, NPS, trends, exports
        +-- schemas.py                   # Pydantic schemas
        +-- static/
            +-- index.html
            +-- styles.css
            +-- script.js
```

## GitHub Artifact Policy

The repository is configured for source code and documentation. Large local artifacts are ignored by `.gitignore`, including:

- `models/`
- `*.safetensors`
- `*.bin`
- `*.pt`
- `*.xlsx`
- generated CSV reports
- virtual environments

This means the trained model files and the Excel dataset are not expected to be pushed to GitHub. To run inference, place trained model artifacts locally in the expected folders or rerun the training notebook.

## Environment Setup

Create and activate a virtual environment from the project root:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

The same dependency list is also available inside `absa_web_app/requirements.txt`.

## Training Workflow

Open and run:

```text
absa_train_save_streamlit_model.ipynb
```

The notebook performs:

1. Dataset loading and preprocessing.
2. Train/validation/test split.
3. Rule-based and TF-IDF baseline training.
4. XLM-RoBERTa Large fine-tuning for aspect detection.
5. XLM-RoBERTa Large fine-tuning for aspect sentiment classification.
6. Optional DeepPavlov RuBERT comparison.
7. Hyperparameter tuning and early stopping.
8. Evaluation with accuracy, precision, recall, F1, macro-F1, and confusion matrix.
9. Saving local Hugging Face model folders.

Expected model output folders:

```text
models/final_model/aspect_model/
models/final_model/sentiment_model/
models/final_model_rubert/aspect_model/
models/final_model_rubert/sentiment_model/
```

Each saved model folder should contain files such as:

```text
config.json
model.safetensors
tokenizer.json
tokenizer_config.json
```

## Hyperparameter Tuning

The notebook includes optional tuning for XLM-RoBERTa Large. It compares candidate configurations on the validation set and selects the best configuration using validation macro-F1.

Tuned parameters include:

- learning rate
- maximum sequence length
- gradient accumulation
- weight decay
- warm-up ratio
- frozen encoder layers
- number of epochs
- early-stopping patience

The test set is used only for final evaluation, not for tuning.

## Running the Web Dashboard

Start the FastAPI app from the web app folder:

```powershell
cd absa_web_app
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000
```

The app loads local models lazily and caches them in memory. CUDA is used when available; otherwise inference runs on CPU.

## API Endpoints

```text
GET  /
GET  /health
POST /api/analyze-single
POST /api/analyze-file
POST /api/export-report
```

Example single-review request:

```json
{
  "text": "Food was tasty, but service was slow.",
  "star_rating": 4,
  "model_name": "XLM-RoBERTa",
  "aspect_threshold": 0.5
}
```

## Excel Upload Format

Only the review text column is required. Other columns are optional and are detected automatically when possible.

Supported data fields:

| Field | Purpose |
|---|---|
| review text | main customer feedback text |
| rating | star rating for NPS-like analytics |
| branch / venue | branch-level comparison |
| date | time trends |
| platform | source filtering and reporting |
| company response | response-rate analytics |
| address | branch display |

If the review column is not detected, the dashboard asks the user to select it manually.

## Analytics Logic

The backend converts model predictions into manager-facing indicators:

- Aspect sentiment shares show what customers praise or criticize.
- SQI converts sentiment and model confidence into a weighted service-quality score.
- NPS-like metrics use star ratings when available.
- Branch analytics compare locations by rating, SQI, negative share, response rate, and strongest or weakest aspects.
- Time trends show rating, sentiment, review count, and SQI changes over time.
- Exports provide prediction tables and multi-sheet Excel reports.

## Model Paths Used by the App

The FastAPI app looks for model folders in these locations:

```text
models/final_model/aspect_model
models/final_model/sentiment_model
models/final_model_rubert/aspect_model
models/final_model_rubert/sentiment_model
```

The app also resolves equivalent paths relative to `absa_web_app/`.

Available model names in the dashboard:

```text
XLM-RoBERTa
RuBERT
```

## Troubleshooting

`Model folder is missing or incomplete`

Check that the local model folder contains `config.json` and model weights such as `model.safetensors`.

`Review text column was not detected`

Select the review text column manually in the browser.

`CUDA out of memory`

Use CPU inference, reduce batch size in `model_service.py`, or use the smaller model option.

`Predictions look inverted`

Check the sentiment label order in `absa_web_app/app/model_service.py`.

`Uploaded file cannot be read`

Use a normal `.xlsx` file that is not password-protected.

## Research Context

The project supports the research topic:

```text
Development of a System for Analyzing and Classifying Customer Reviews
of Restaurants and Fast-Food Chains to Assess Service Quality
```

It demonstrates both the machine-learning part of ABSA and the applied decision-support layer for service-quality monitoring.
