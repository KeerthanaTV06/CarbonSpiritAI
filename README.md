# 🌿 Carbon Spirit – Your AI Climate Companion

A full-stack AI-powered web application that analyzes your lifestyle habits and uses **Google Gemini AI** to create a personalized "Carbon Spirit" — a symbolic identity that embodies your environmental impact.

---

## ✨ Features

- **AI-Generated Spirit Identity** — Gemini creates a unique name, title, and personality
- **AI Backstory & Narrative** — Poetic origin story tied to your actual habits
- **Carbon Score (0–100)** — Weighted sustainability scoring across 9 lifestyle categories
- **AI Impact Analysis** — Specific carbon footprint assessment from Gemini
- **AI Strengths & Weaknesses** — Personalized identification of eco habits
- **4 AI Recommendations** — Tailored, actionable steps from Gemini
- **AI Vision for 2050** — Future prediction based on your specific lifestyle
- **AI Motivation Message** — Personal encouragement from your spirit
- **Premium Dark UI** — Glassmorphism, animated score ring, particle effects

---

## 🗂️ Project Structure

```
carbon-spirit/
├── carbon-spirit-frontend/     # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Assessment.jsx
│   │   │   └── Results.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js
│
└── carbon-spirit-backend/      # Python Flask + Gemini AI
    ├── app.py                  # Flask server + routes
    ├── gemini_service.py       # Gemini API integration
    ├── calculator.py           # Sustainability score engine
    ├── requirements.txt
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Gemini API key ([get one free here](https://aistudio.google.com/app/apikey))

---

### 1. Backend Setup

```bash
cd carbon-spirit-backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and set: GEMINI_API_KEY=your_actual_key_here

# Start the Flask server
python app.py
```

The backend will run at **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd carbon-spirit-frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will run at **http://localhost:5173**

> The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no CORS issues.

---

## 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key into your `.env` file:
   ```
   GEMINI_API_KEY=AIzaSy...your-key-here
   ```

---

## 🌐 API Reference

### `POST /api/analyze`

**Request:**
```json
{
  "answers": {
    "transport": "bike_walk",
    "food": "vegan",
    "electricity": "renewable",
    "shopping": "secondhand",
    "recycling": "zero_waste",
    "water": "very_careful",
    "travel": "never",
    "digital": "minimal",
    "home": "excellent"
  }
}
```

**Response:**
```json
{
  "score": 100,
  "spiritName": "The Verdant Tide Keeper",
  "title": "Guardian of the Living Shores",
  "story": "Born where rivers meet the sea...",
  "impact": "Your lifestyle carries one of the lowest carbon footprints...",
  "strengths": ["Fully plant-based diet", "Zero-emission transport", "..."],
  "weaknesses": ["Digital streaming consumption", "..."],
  "recommendations": ["...", "...", "...", "..."],
  "vision2050": "By 2050, if millions follow your path...",
  "motivation": "The Verdant Tide Keeper stirs the waters of change..."
}
```

### `GET /api/health`

Returns `{ "status": "ok" }` — use to check if the backend is running.

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Animations | CSS Animations + Canvas API |
| Backend | Python Flask 3 |
| CORS | Flask-CORS |
| AI | Google Gemini 2.0 Flash |
| Environment | python-dotenv |

---

## ⚡ Sustainability Score Methodology

The score (0–100) is calculated using a weighted average across 9 categories:

| Category | Weight |
|----------|--------|
| Transportation | 18% |
| Food & Diet | 18% |
| Electricity Usage | 14% |
| Travel Frequency | 12% |
| Shopping Behavior | 10% |
| Home Efficiency | 10% |
| Recycling | 8% |
| Water Conservation | 6% |
| Digital Consumption | 4% |

Higher score = more sustainable lifestyle.

---

## 🏆 Hackathon Highlights

- **AI is the primary feature**, not a cosmetic addition
- Every result is **100% dynamically generated** by Gemini — no hardcoded responses
- Rich **prompt engineering** with user-specific context
- **Structured JSON responses** from Gemini with validation
- Production-ready error handling and environment configuration
- Premium UI that wows judges from first glance

---

*Built with ❤️ and 🌿 — powered by Google Gemini AI*
