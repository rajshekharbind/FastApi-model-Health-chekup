# FastAPI ML & LLM Prediction Platform 🚀

A **scalable, production-ready FastAPI application** for machine learning predictions, real-time communication, and LLM-powered intelligence. This project demonstrates **clean architecture**, **Pydantic-based validation**, **ML model lifecycle management**, and **cloud-ready deployment**.

Designed for **industry-grade ML + GenAI systems**.

---

## ✨ Key Highlights

* ⚡ High‑performance **FastAPI** backend
* 🧠 **Machine Learning model inference** (insurance prediction use case)
* 📦 **Pydantic schemas** for strict request & response validation
* 🔁 **Model retraining & rebuild pipeline**
* 🔌 **WebSocket support** for real-time updates
* 🌐 **Frontend integration** (HTML, CSS, JavaScript)
* 🤖 **LLM‑ready architecture** (OpenAI / HuggingFace / Ollama compatible)
* ☁️ Cloud‑deployable (AWS, Render, Docker)

---

## 🧩 Tech Stack

### Backend

* **FastAPI** – REST APIs & async performance
* **Uvicorn / Gunicorn** – ASGI server
* **Pydantic** – Data validation & schema enforcement
* **WebSockets** – Real-time communication

### Machine Learning

* **Scikit‑learn** – Model training & prediction
* **Pandas / NumPy** – Data processing
* **Joblib / Pickle** – Model serialization

### Frontend

* **HTML5** – UI structure
* **CSS3** – Styling
* **JavaScript (ES6)** – Client-side logic
* **WebSocket Client** – Live updates

### LLM / GenAI (Extensible)

* **OpenAI GPT APIs**
* **HuggingFace Transformers**
* **Local LLMs (Ollama, LLaMA, Mistral)**

### DevOps & Deployment

* **AWS EC2 / Render** – Hosting
* **Docker (optional)** – Containerization
* **Nginx** – Reverse proxy
* **systemd** – Process management
* **Git & GitHub** – Version control

---

## 📂 Project Structure

```text
fastapi-model-prediction/
│
├── app.py                   # FastAPI app entry point
├── frontend.py              # Frontend routes
├── websocket_setup.py       # WebSocket handlers
│
├── config/                  # App & environment configuration
│   └── settings.py
│
├── model/                   # ML models & prediction logic
│   ├── trained_model.pkl
│   └── predictor.py
│
├── schema/                  # Pydantic schemas
│   ├── input_schema.py
│   └── output_schema.py
│
├── rebuild_model.py         # Retrain & rebuild ML model
├── insurance.csv            # Dataset
│
├── index.html               # Frontend UI
├── style.css                # Styling
├── script.js                # Frontend JS
├── realtime.js              # WebSocket client
│
├── ml-model-fastapi.ipynb   # Model experimentation
├── requirements.txt         # Dependencies
├── README.md                # Documentation
└── .git/
```

---

## 🔐 Pydantic Schema Example

```python
from pydantic import BaseModel

class PredictionInput(BaseModel):
    age: int
    bmi: float
    children: int
    smoker: bool
    region: str
```

✔ Automatic validation
✔ API contract enforcement
✔ Error‑safe inputs

---

## ⚡ FastAPI API Example

```python
from fastapi import FastAPI
from schema.input_schema import PredictionInput

app = FastAPI(title="ML & LLM Prediction API")

@app.post("/predict")
def predict(data: PredictionInput):
    result = model.predict(data)
    return {"prediction": result}
```

---

## 🔌 WebSocket Example

```python
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    await ws.send_text("WebSocket Connected")
```

Used for:

* Live predictions
* Streaming analytics
* Realtime dashboards

---

## 🤖 LLM Integration (Optional)

This architecture can be extended for:

* Natural language queries → ML predictions
* Auto‑generated insights & explanations
* AI‑powered analytics assistants

---

## ▶️ Running Locally

### 1️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 2️⃣ Start server

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 3️⃣ Access

* API Docs: `http://localhost:8000/docs`
* Frontend: `http://localhost:8000/`

---

## ☁️ Deployment Notes

* Use **Render / AWS EC2**
* Expose correct port (Render → `10000`)
* Recommended stack:

  * `Gunicorn + Uvicorn`
  * `Nginx`
  * `systemd`

---

## 🚀 Future Enhancements

* Docker & Docker Compose
* CI/CD pipeline
* Authentication (JWT)
* Model registry & versioning
* Full LLM analytics layer

---


---

⭐ If you like this project, don’t forget to **star the repository**!
