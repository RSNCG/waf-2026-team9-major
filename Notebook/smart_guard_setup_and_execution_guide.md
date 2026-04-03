# SmartGuard – Setup and Execution Guide

This guide provides **step-by-step instructions** to set up the SmartGuard environment and run the application on a new system (Windows, macOS, or Linux).

---

## Prerequisites

### Python
- **Python 3.8 or higher** is required

Check your Python version:
```bash
python --version
# or
python3 --version
```

If Python is not installed, download it from:
- https://www.python.org

---

## Step 1: Clone or Extract the Project

Clone the repository or extract the project ZIP file.

Ensure the folder structure looks like this:

```text
SmartGuard/
│
├── app.py                 # Main Flask application (RUN THIS FILE)
├── requirements.txt       # Python dependencies
├── README.md              # Project documentation
│
├── models/                # IMPORTANT: ML model files
│   ├── attack_classifier.pkl
│   ├── feature_extractor.pkl
│   └── lime_explainer.pkl
│
├── templates/
│   └── *.html
│
└── static/
    ├── css/
    └── js/
```

---

## Step 2: Set Up a Virtual Environment (Recommended)

Using a virtual environment avoids dependency conflicts.

### Windows
```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

✅ If successful, your terminal prompt will show `(venv)`.

---

## Step 3: Install Dependencies

Install all required Python packages:

```bash
pip install -r requirements.txt
```

### If `requirements.txt` Is Missing

Install dependencies manually:
```bash
pip install Flask numpy joblib scikit-learn lime
```

---

## Step 4: Verify Model Files

SmartGuard **will not run** without trained models.

Navigate to the `models/` directory and ensure the following files exist:

- `attack_classifier.pkl`
- `feature_extractor.pkl`
- `lime_explainer.pkl`

📌 If these files are missing:
- Run the training notebook: `SmartGuard_Waf_V1.ipynb`
- This will generate the required `.pkl` files

---

## Step 5: Run the Application

### Command to Run SmartGuard

From the **SmartGuard root directory**, run:

```bash
python app.py
```

On some systems:
```bash
python3 app.py
```

🚀 This starts the Flask development server.

---

## Step 6: Access the Application

Open your web browser (Chrome, Firefox, Edge, etc.) and go to:

```text
http://127.0.0.1:5000
# or
http://localhost:5000
```

You should now see the **SmartGuard web interface**.

---

## Troubleshooting Common Issues

### 1. ModuleNotFoundError: No module named '...'

**Cause:** Dependencies not installed or virtual environment not active.

**Fix:**
```bash
pip install -r requirements.txt
```
Ensure `(venv)` is visible in your terminal.

---

### 2. sqlite3.OperationalError: database is locked

**Cause:** Application crashed during a database write.

**Fix:**
- Stop the server (`Ctrl + C`)
- Restart:
```bash
python app.py
```

📌 Note: SmartGuard uses **WAL mode** to reduce this issue.

---

### 3. ValueError: node array from the pickle has an incompatible dtype

**Cause:** Model files were created using a different `scikit-learn` version.

**Fix (Recommended):**
- Retrain the models using `SmartGuard_Waf_V1.ipynb` in your current environment

**Alternative Fix:**
- Install the exact scikit-learn version used during training

---

### 4. Address already in use (Port 5000)

**Cause:** Another application is using port `5000`.

**Fix:**

1. Open `app.py`
2. Modify:
```python
app.run(debug=True, port=5000)
```
3. Change to:
```python
app.run(debug=True, port=5001)
```
4. Restart the app

Access at:
```text
http://localhost:5001
```

---

## How to Run (Quick Summary)

```bash
# Activate virtual environment
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

# Install dependencies
pip install -r requirements.txt

# Run SmartGuard
python app.py
```

---

✅ SmartGuard is now successfully set up and running.

For model upgrades or experimentation, refer to:
**SmartGuard Model Switching Guide**

