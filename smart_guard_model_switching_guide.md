# SmartGuard Model Switching Guide

This document serves as a reference for future developers or researchers who wish to **upgrade, swap, or experiment with different Machine Learning models** (e.g., TF-IDF, Word2Vec, LSTM, or different classifiers) within the **SmartGuard** architecture.

---

## 1. Current Architecture (Baseline)

**Input**  
Raw HTTP Payload String  
Example:
```
'admin' OR 1=1'
```

**Feature Engineering**  
Manual structural analysis producing **14 numerical features**:
- Payload length
- Special character count
- Digit count
- Entropy
- SQL keyword count
- etc.

**Preprocessing**  
- `MinMaxScaler`
- File: `feature_extractor.pkl`

**Model**  
- `RandomForestClassifier`
- File: `attack_classifier.pkl`

**Explainability**  
- `LimeTabularExplainer`
- File: `lime_explainer.pkl`

---

## 2. Scenario A: Swapping Classifier Only

**Example:** Switching from Random Forest → XGBoost / SVM / Neural Network  
(**14 structural features remain unchanged**)

### What to Edit

#### Train & Save
Train your new classifier using the **same 14 numerical features**.

Save it using Joblib:
```
attack_classifier.pkl
```

#### Replace File
Overwrite:
```
models/attack_classifier.pkl
```

#### Update `app.py`

**Model Loading**  
No change required (if Joblib-compatible).

**Prediction Logic**  
No change required.

**Explainability (Important)**  
- LIME requires `predict_proba`
- Some classifiers (e.g., vanilla SVM) do **not** support probability output

✅ Ensure your model supports:
```
predict_proba()
```

---

## 3. Scenario B: Switching to NLP (TF-IDF / Bag of Words)

**Example:** TF-IDF + Logistic Regression

This scenario replaces **manual numerical features** with **text vectorization**.

---

### Step 1: Prepare the Models

In your training notebook:

1. Train a `TfidfVectorizer` on HTTP payloads
2. Train a classifier (e.g., `LogisticRegression`)

Save the models:
```python
joblib.dump(tfidf_vectorizer, 'feature_extractor.pkl')  # Replaces scaler
joblib.dump(log_reg_model, 'attack_classifier.pkl')
```

---

### Step 2: Update `app.py`

#### A. Update Model Loading

```python
# Old
scaler = joblib.load('feature_extractor.pkl')

# New
vectorizer = joblib.load('feature_extractor.pkl')
```

---

#### B. Update Feature Extraction Logic

Locate the `analyze()` function.

**Old Logic (Numerical Features):**
```python
raw_features = extract_features_from_payload(payload)
features_array = np.array(raw_features).reshape(1, -1)
scaled_features = scaler.transform(features_array)
prediction = clf.predict(scaled_features)[0]
```

**New Logic (TF-IDF):**
```python
vectorized_input = vectorizer.transform([payload])
prediction = clf.predict(vectorized_input)[0]
proba = clf.predict_proba(vectorized_input)[0]
```

> ℹ️ You may keep the 14-feature extraction for **UI statistics**, but it should not be used for prediction.

---

### Step 3: Update Explainability (LIME)

`LimeTabularExplainer` ❌ does **not** work for text.

You must switch to **LimeTextExplainer**.

#### A. Import
```python
from lime.lime_text import LimeTextExplainer
```

#### B. Initialize Explainer
```python
explainer = LimeTextExplainer(class_names=['Normal', 'Attack'])
```

#### C. Prediction Function for LIME
```python
def predict_fn(texts):
    vec = vectorizer.transform(texts)
    return clf.predict_proba(vec)
```

#### D. Generate Explanation
```python
exp = explainer.explain_instance(payload, predict_fn, num_features=6)
```

---

## 4. Scenario C: Deep Learning (LSTM / BERT)

**Example:** TensorFlow / PyTorch-based models

---

### What to Edit

#### Dependencies
Add required libraries:
```
tensorflow
# or
torch
```

---

#### Model Loading

Joblib ❌ is **not recommended** for DL models.

**TensorFlow Example:**
```python
from tensorflow.keras.models import load_model
model = load_model('models/attack_model.h5')
```

---

#### Preprocessing

Replace scaler/vectorizer with:
- `Tokenizer`
- `pad_sequences`

Save tokenizer separately (`.json` or `.pkl`).

---

#### Prediction Logic

Deep learning models usually return a **probability score**:

```python
pred_score = model.predict(processed_input)[0][0]
prediction = 1 if pred_score > 0.5 else 0
```

---

#### Explainability

- LIME **Text** can still be used
- SHAP is recommended for DL models

---

## 5. Summary Checklist for Migration

| Component Changed | Files to Replace | `app.py` Functions to Edit |
|------------------|------------------|----------------------------|
| Classifier Only | `attack_classifier.pkl` | None (usually) |
| Feature Method | `feature_extractor.pkl`, `attack_classifier.pkl` | `analyze()`, `extract_features()` |
| LIME Type | `lime_explainer.pkl` | `analyze()` (Tabular ↔ Text) |

---

## 6. Best Practices

- Keep file names consistent to avoid breaking loaders
- Version models clearly (`v1`, `v2`, etc.)
- Always validate `predict_proba` support
- Re-test LIME explanations after every model change

---

✅ This guide ensures SmartGuard remains **model-agnostic**, **extensible**, and **research-friendly**.

