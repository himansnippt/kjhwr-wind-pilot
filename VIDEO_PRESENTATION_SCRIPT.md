# 🎥 10-Minute Video Demo Script (Gridbricks / Reint AI Challenge)
> **Format:** Max 10 minutes total (Recorded via Loom, OBS, or YouTube Screen Share)  
> **Structure:**  
> - **Part 1 (0:00 – 4:45):** Client Executive Presentation (Energy Utility Day-Ahead Trading Desk)  
> - **Part 2 (4:45 – 9:30):** Technical Lead Architecture & Code Review (Internal Knowledge Transfer)

---

## 🎬 PART 1: Client Executive Presentation (0:00 – 4:45)
*(Tone: Confident, commercial, domain-literate product consultant)*

### [0:00 – 0:45] The Hook & Problem Statement
> *"Hello everyone. Welcome to the walkthrough of our UK Day-Ahead Wind Forecasting and Accuracy Valuation Platform, delivered as the output of our pilot project for your energy utility trading desk.*
>
> *As day-ahead power buyers, your core mandate is to serve your retail and industrial customers reliably while minimizing procurement costs on the wholesale market. The fundamental challenge you face every single morning is weather dependency: you must lock in your purchase decisions for tomorrow by the 12:00 UTC day-ahead gate closure, but wind generation is inherently volatile.*
>
> *If you over-rely on an optimistic wind forecast and wind generation falls short, you face exorbitant National Grid cash-out imbalance penalties. If you over-hedge with expensive thermal power, you unnecessarily tie up capital. This platform was purpose-built to quantify that uncertainty and give you decisive, data-backed buying signals."*

### [0:45 – 2:30] Live Dashboard Walkthrough & January 2026 Metrics
*(Screen share: Hover over MetricCards and ForecastChart)*
> *"Let's look at the pilot results for **January 2026**, ingesting official 30-minute settlement data from Elexon BMRS.*
>
> *Across the top, our executive KPI cards instantly highlight the macro picture:*
> 1. *Total national wind generation generated in January 2026 was **7,942 GWh**, against an aggregate forecast of **8,120 GWh**.*
> 2. *Our **Mean Absolute Error (MAE)** sits at **712 MW**, with a relative **MAPE of 6.8%**. In wholesale power terms, this gives you a clean baseline: on average, expected wind deviation is within 712 MW.*
> 3. *Crucially, look at the **Forecast Bias metric**: it shows a **net positive bias of +178 MW**. That is an actionable commercial finding: in January 2026, the national wind forecast exhibited a persistent over-forecasting tendency, meaning actual wind generation under-delivered relative to expectations.*
> 4. *Our **Max Under-Generation Shock** reveals the single worst period where wind dropped **1,480 MW** below expectations. That is the exact capacity shock your thermal backup portfolio must be sized to handle."*

### [2:30 – 3:45] Interactive Time-Series & Hourly Uncertainty Profile
*(Screen share: Pan through the 30-min settlement chart, switch between Week 1 and Week 2, point out evening ramp hours)*
> *"Moving down to our interactive settlement time-series, you can inspect each of the 48 half-hour settlement periods per day. Notice the green line representing actuals from FUELHH and the dashed blue line showing the day-ahead forecast from WINDFOR.*
>
> *Notice on the right our **24-Hour Diurnal Uncertainty Profile**: forecast error is not uniform throughout the day. Between **16:00 and 20:00 UTC**—the critical UK evening peak demand window—MAE spikes above **840 MW** with an intensified over-forecast bias. This is the danger window where wind drops coincide with maximum consumer power demand."*

### [3:45 – 4:45] Actionable Day-Ahead Trading Recommendation
*(Screen share: Highlight the Procurement Advisory Box)*
> *"To translate these numbers directly into daily trading operations, our **Day-Ahead Procurement Advisory** computes a statistical hedge buffer. Based on the 95th percentile under-generation shock, we recommend contracting a spinning thermal reserve buffer of **820 MW** during peak hours.*
>
> *Traders can also filter and search any historical settlement day in the audit table below, or export the entire reconciliation dataset to CSV for proprietary risk modeling.*
>
> *In summary, this pilot transforms raw Elexon telemetry into automated, quantified risk mitigation, ensuring your utility meets consumer demand reliably at the lowest possible procurement cost."*

---

## 🎬 PART 2: Technical Lead Code & Architecture Review (4:45 – 9:30)
*(Tone: High-agency software engineer, clear, disciplined, best practices)*

### [4:45 – 6:00] Architecture & Domain Design Decisions
> *"Hi everyone, now shifting into Part 2 for the internal technical review.*
>
> *Let's start with the high-level architecture. We opted for a clean, decoupled full-stack architecture:*
> - *Backend: Python **FastAPI**, chosen for its native async capabilities, type safety via Pydantic v2, and high-performance vectorized data manipulation with NumPy and Pandas.*
> - *Frontend: **React 19** with **Vite**, styled with **Tailwind CSS**, and utilizing **Recharts** for hardware-accelerated time-series rendering.*
>
> *The most critical domain decision here is the **Day-Ahead Gate Closure Matching Logic** in `analytics_engine.py`:*
> *In the UK electricity market (EPEX SPOT and Nord Pool), day-ahead auctions close by 12:00 UTC on day $D-1$. In the Elexon `WINDFOR` dataset, multiple forecasts are published continuously. A naive implementation would simply match the latest forecast published right before delivery. But that is cheating—a day-ahead trader doesn't have that data!*
>
> *Our engine strictly filters for the latest forecast published **prior to the 12:00 UTC Day-Ahead gate closure on $D-1$**. This guarantees that the error metrics genuinely reflect what was visible to the trading desk when bids were submitted."*

### [6:00 – 7:30] Backend Codebase Tour & Numerical Engine
*(Screen share: Open VS Code, show `elexon_client.py` and `analytics_engine.py`)*
> *"Let's take a quick look at the backend structure:*
> 1. *`app/services/elexon_client.py`: Connects to the public Elexon BMRS stream endpoints (`FUELHH` for wind actuals, `WINDFOR` for forecasts). To make the platform resilient to external network hiccups and cold starts, we implement a local JSON persistence layer in `backend/data/`.*
> 2. *`app/services/analytics_engine.py`: Implements clean vectorized mathematical calculations:*
>    - *MAE: Mean of absolute differences.*
>    - *RMSE: Root of squared differences, which quadraticizes outlier deviations.*
>    - *Forecast Bias: Mean error with signed direction.*
>    - *MAPE: Relative percentage error normalized by actual generation.*
> 3. *`app/models/schemas.py`: Explicit Pydantic response models ensuring strict contract enforcement between frontend and backend.*
> 4. *`app/main.py`: Exposes clean, RESTful endpoints (`/api/overview`, `/api/timeseries`, `/api/daily-summary`, `/api/decision-advisory`) with automated OpenAPI/Swagger documentation at `/docs`."*

### [7:30 – 8:30] Testing, Engineering Hygiene & Docker
*(Screen share: Show `tests/test_analytics.py`, run `python -m unittest discover -s tests`, show `docker-compose.yml`)*
> *"In line with high engineering standards, we wrote unit tests in `backend/tests/test_analytics.py`.*
> *Running the test suite via Python's built-in `unittest` runner shows all tests passing in sub-second time. We test for:*
> - *Exact numerical accuracy of MAE, RMSE, and Bias on controlled synthetic edge cases.*
> - *Graceful empty dataframe handling for out-of-range dates.*
> - *Accurate classification of over-forecasting vs under-forecasting bias.*
>
> *For containerization, we provided a multi-stage `Dockerfile` for the FastAPI backend and an Nginx-backed multi-stage `Dockerfile` for the React frontend, fully orchestrated with `docker-compose.yml`.*
> *Any engineer or client can run `docker compose up --build` and spin up the complete environment in under 60 seconds."*

### [8:30 – 9:15] Frontend Architecture & Production Deployment
*(Screen share: Show `frontend/src/App.jsx` and live deployment URL)*
> *"On the frontend:*
> - *The state is decoupled: date filters update the 30-minute settlement windows reactively.*
> - *The UI includes an embedded high-fidelity offline fallback generator, guaranteeing that the application never breaks or renders blank screens even if the live external Elexon stream experiences downtime.*
> - *The frontend is deployed live on Vercel, and the backend is deployed on Render.*
> - *All code has been committed to a clean, anonymous public GitHub repository as instructed."*

### [9:15 – 9:30] Closing
> *"Thank you for your time. The codebase is clean, tested, documented in the README, and ready for immediate review. I look forward to your feedback!"*
