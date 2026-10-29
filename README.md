# UK Day-Ahead Wind Forecasting & Valuation Platform
> **Anonymous Submission Repository:** `kjhwr-wind-pilot`  
> **Client Domain:** UK Electricity Utility — Day-Ahead Wholesale Trading Desk  
> **Data Authority:** Elexon BMRS (Actuals: `FUELHH` [WIND] | Forecasts: `WINDFOR`)  
> **Target Delivery Period:** January 2026 (30-Minute Settlement Periods)

---

## 1. Executive Summary

This application is a production-ready, full-stack decision-support system built for an energy utility operating in the UK day-ahead wholesale electricity market. 

To serve customer demand reliably, energy buyers must decide one day prior to delivery ($D-1$) how much additional power must be procured from thermal/gas power plants beyond expected renewable generation. Because wind generation is highly weather-dependent, unquantified forecast errors expose the utility to costly imbalance penalties from National Grid ESO.

This platform solves this by:
1. **Aggregating and matching latest wind forecasts** available at the UK Day-Ahead Market Gate Closure (12:00 UTC day $D-1$).
2. **Quantifying forecast errors mathematically** (MAE, RMSE, MAPE, Forecast Bias).
3. **Providing actionable trading advisories** on thermal spinning reserve requirements to hedge against 95th percentile under-generation shock risks.

---

## 2. Directory & File Structure

```
kjhwr-wind-pilot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application, CORS, and REST endpoints
│   │   ├── config.py                   # App configuration and Elexon BMRS endpoint definitions
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py              # Pydantic data validation schemas
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── elexon_client.py        # Stream client for Elexon BMRS FUELHH & WINDFOR
│   │       └── analytics_engine.py     # Gate closure matching, MAE/RMSE/MAPE & advisory engine
│   ├── tests/
│   │   └── test_analytics.py           # Unit test suite verifying metrics and edge cases
│   ├── data/                           # Local persistence cache for January 2026 datasets
│   ├── requirements.txt                # Python backend dependencies
│   └── Dockerfile                      # Multi-stage production container for FastAPI
│
├── frontend/
│   ├── public/                         # Static assets and favicons
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation bar, date filter pills, connection badge
│   │   │   ├── MetricCards.jsx         # Executive KPI cards (GWh, MAE, RMSE, Bias, Shock)
│   │   │   ├── ForecastChart.jsx       # Interactive 30-min settlement timeseries area chart
│   │   │   ├── ErrorDistributionChart.jsx # 24-hour diurnal uncertainty profile bar chart
│   │   │   ├── ProcurementAdvisory.jsx # Thermal plant hedging recommendations & findings
│   │   │   └── SettlementTable.jsx     # Searchable 48-period audit log with CSV export
│   │   ├── App.jsx                     # Root application container with API & fallback engine
│   │   ├── main.jsx                    # React 19 entrypoint
│   │   └── index.css                   # Tailwind styles and custom dark theme scrollbars
│   ├── index.html                      # HTML5 template with Plus Jakarta Sans & JetBrains Mono
│   ├── package.json                    # Frontend dependencies (React, Vite, Recharts, Lucide)
│   ├── vite.config.js                  # Vite configuration with backend proxy
│   ├── tailwind.config.js              # Theme and color tokens
│   ├── nginx.conf                      # Production Nginx reverse-proxy configuration
│   └── Dockerfile                      # Production multi-stage Nginx build
│
├── docker-compose.yml                  # One-click multi-container orchestration
└── README.md                           # System architecture and deployment guide
```

---

## 3. How to Start the Application

### Option A: Running with Docker (Recommended)
Prerequisites: Docker and Docker Compose installed.

```bash
# 1. Clone the repository
git clone https://github.com/anonymous/kjhwr-wind-pilot.git
cd kjhwr-wind-pilot

# 2. Build and start both frontend and backend
docker compose up --build
```
- **Web Dashboard:** Open `http://localhost:3000`
- **FastAPI Swagger API Docs:** Open `http://localhost:8000/docs`

---

### Option B: Running Locally (Development Mode)

#### 1. Backend Setup:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt

# Run unit tests
python -m unittest discover -s tests

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend Setup:
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 4. Key Engineering & Market Design Decisions

1. **UK Day-Ahead Gate Closure Matching:**
   - In the UK wholesale market (EPEX SPOT / Nord Pool UK), physical day-ahead auctions close by **12:00 UTC day-ahead ($D-1$)**. 
   - Instead of matching actuals with post-event forecasts, our pipeline strictly matches each target delivery period on day $D$ with the **latest available forecast published prior to the Day-Ahead gate closure**. This mirrors the exact data available to traders when submitting bids.
2. **Quantitative Accuracy Metrics:**
   - **MAE (Mean Absolute Error):** Reflects the average volume error in Megawatts (MW).
   - **RMSE (Root Mean Squared Error):** Heavily penalizes extreme forecast errors, highlighting periods when sudden wind drops occur.
   - **MAPE (%):** Normalizes the error relative to actual generation volume.
   - **Forecast Bias:** Differentiates systematic over-forecasting (under-delivery risk) from under-forecasting (surplus wind).
3. **Resilience & Local Caching:**
   - Elexon BMRS stream responses are cached on disk as structured JSON in `backend/data/`. This enables zero-latency cold starts, immune to external network interruptions.

---

## 5. Live Deployment Links

- **Frontend Application (Vercel):** `https://kjhwr-wind-pilot.vercel.app` *(or provided live link)*
- **Backend API Service (Render):** `https://kjhwr-wind-backend.onrender.com/docs`

---

## 6. Disclosure of AI Tools Used

In accordance with challenge instructions, AI coding assistants (Google DeepMind Antigravity / Claude 3.5 Sonnet) were used during the development of this application to accelerate API client scaffolding, styling layout with Tailwind CSS, and unit test generation. All architectural decisions, market domain logic, and financial error calculations were verified and designed for the UK energy trading context.
