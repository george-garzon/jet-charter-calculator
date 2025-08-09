# ✈️ Private Jet Price & Ops Optimizer

A full-stack **Django + Next.js 15** application that:

- Calculates **private jet trip pricing** (DOC + margin + weather-adjusted performance)
- Runs an **operations optimizer** to assign aircraft to multi-leg trips (minimizing reposition NM)
- Supports **ML-based price predictions** (Scikit-learn regressor)
- Generates **PDF quotes** with route maps and cost breakdowns
- Includes **multi-leg scenarios** for testing (Tiny Sample, Coast to Coast, Europe Tour, etc.)

---

## 🗂 Project Structure

```
project-root/
│
├── backend/                # Django API (pricing, optimizer, ML, PDF)
│   ├── api/                 # Django app with endpoints
│   ├── manage.py
│   ├── requirements.txt
│
├── frontend/               # Next.js 15 app (React Server Components + Tailwind)
│   ├── app/
│   ├── components/
│   ├── package.json
│   ├── tsconfig.json
│
└── README.md
```

---

## 🚀 Quickstart

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

---

### 2️⃣ Backend — Django API

#### Install dependencies
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Apply migrations
```bash
python manage.py migrate
```

#### Run the API server
```bash
python manage.py runserver
```
The API will be available at:
```
http://127.0.0.1:8000
```

---

### 3️⃣ Frontend — Next.js

#### Install dependencies
```bash
cd ../frontend
npm install
```

#### Run dev server
```bash
npm run dev
```
The frontend will be available at:
```
http://localhost:3000
```

---

## 🌐 API Endpoints

| Endpoint                | Method | Description |
|-------------------------|--------|-------------|
| `/api/pricing/calc`     | POST   | Calculate trip cost based on inputs |
| `/api/pricing/ml`       | POST   | Predict trip cost using ML model |
| `/api/pdf/quote`        | POST   | Generate PDF quote with route map |
| `/api/optimizer/run`    | POST   | Assign aircraft to legs minimizing reposition NM |

**Sample `optimizer/run` request:**
```json
{
  "aircraft": [
    {"tail": "N123", "position": "KTEB"},
    {"tail": "N456", "position": "KVNY"}
  ],
  "legs": [
    {"id": "L1", "start": "KTEB", "end": "KMIA"},
    {"id": "L2", "start": "KVNY", "end": "KLAS"}
  ]
}
```

---

## 🖥 Frontend Pages

| Route         | Description |
|---------------|-------------|
| `/pricing`    | Price calculator (select jet, destination, weather, etc.) |
| `/ops`        | Operations optimizer (assigns tails to legs) |

---

## 🧠 ML Model

- Located in `backend/api/ml.py`
- Uses `scikit-learn` regression to predict prices from:
  - Distance NM
  - Jet type & model
  - Weather adjustments
  - Runway constraints
- Trained on synthetic dataset for demo purposes

---

## 📄 PDF Quote Generator

- Generates professional trip quotes with:
  - Route map image
  - Price breakdown
  - DOC + margin summary
- Uses `reportlab` for PDF creation

---

## 🧪 Sample Data

Frontend provides buttons to load pre-built datasets:

- **Tiny Sample** – 1 aircraft, 2 legs
- **Coast to Coast** – East & West coast tails, 3 legs
- **Europe Tour** – London → Paris → Barcelona → Rome → Frankfurt
- **Busy Fleet** – 4 aircraft, 6+ legs

---

## ⚙️ Environment Variables

Backend (`backend/.env`):
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
```

Frontend (`frontend/.env.local`):
```
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

---

## 🏁 Running Both Together

From project root:
```bash
# Terminal 1
cd backend && source venv/bin/activate && python manage.py runserver

# Terminal 2
cd frontend && npm run dev
```
