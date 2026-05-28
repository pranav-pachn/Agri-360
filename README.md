# AgriMitra 360

[![Status](https://img.shields.io/badge/status-prototype-blue)](#known-gaps--reality-check)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61dafb)](#tech-stack)
[![Backend](https://img.shields.io/badge/backend-Express-000000)](#tech-stack)
[![AI](https://img.shields.io/badge/ai-TensorFlow.js-orange)](#tech-stack)
[![Weather](https://img.shields.io/badge/live%20weather-OpenWeather-ffb703)](#live-weather-overlay)
[![Database](https://img.shields.io/badge/data-Supabase-3ecf8e)](#tech-stack)

Full-stack agricultural intelligence prototype, transparent agricultural risk scoring, and finance-ready trust intelligence for smallholder farmers.

One-line pitch: Turn a crop image and farm context into lender-ready insights and recommendations.

## 🚀 Key Highlights

- Transparent Risk Breakdown — interpretable breakdowns for every score.
- Real-time Weather Integration — live weather affects risk and recommendations.
- Finance-ready Trust Score — lender-focused signals and eligibility framing.
- Multilingual AI Assistant — English, Hindi, and Telugu support for field teams.

## At A Glance
| Area | What It Does |
| --- | --- |
| Image Classification | Upload a crop image and generate disease mapping, severity, health, and recovery guidance |
| Risk Formula | Compute weighted agricultural risk using model confidence, severity, and live weather context |
| Yield Projection | Estimate yield and expected loss from risk-aware crop logic |
| Trust Intelligence | Convert farm performance into finance-ready trust and eligibility signals |
| Dashboard | Surface live risk, weather impact, trends, and recommendations in one workspace |
| AI Assistant | Answer context-aware questions about risk, yield, trust, and loan readiness |

## Product Preview

The most recruiter-facing visuals are shown below — priority order: Dashboard, Result page, Chat assistant.

![Dashboard](docs/screenshots/dashboard.png)

![Result Page](docs/screenshots/result-page.png)

![Chat Assistant](docs/screenshots/chat.png)

### Product Highlights
- End-to-end workflow: image upload → diagnosis → risk & yield → lender-ready summary.
- Live environmental signal: weather actively informs risk and recommendations.
- Finance-aware outputs: trust score and eligibility framing for agri-credit scenarios.

(Support assets and capture guidance moved to `docs/screenshots/README.md`.)

## Why This Project Stands Out

- **Crop image classification workflow**: image upload feeds disease mapping, severity, health scoring, recovery guidance, and a full result page.
- **Transparent risk + trust logic**: outputs are structured so users and reviewers can see why a score moved, not just the final number.
- **Live weather integration**: OpenWeather data can influence risk during analysis and also appears as a live dashboard overlay.
- **Finance-facing product layer**: trust score, eligibility state, pending applications, and analytics push the project beyond a pure ML showcase.
- **Multilingual AI assistant**: the chat experience is grounded in live farm context and supports English, Hindi, and Telugu UI flows.
- **Portfolio-ready frontend**: protected app shell, analytics views, crop intelligence workspace, and dashboard experience.

## 📊 Model Performance & Validation

- Dataset scope: **Synthetic benchmark dataset for 10 districts × 6 crops**
- Evaluation: **Rule-based risk scoring validated against 151 synthetic farm profiles.**

### Observations
- Weather volatility significantly impacts high-risk predictions.
- Crop health strongly correlates with yield stability.
- The analytics layer exposes comparable predicted vs actual yield patterns for reviewer inspection.

### 📈 Sample Visualization

Below are recruiter-facing proof charts showing model outputs vs observed data.

![Predicted vs Actual Yield](docs/screenshots/yield-vs-actual.png)

![Risk Distribution](docs/screenshots/risk-distribution.png)

### Validation Notes
- The proof layer is backed by the synthetic agricultural dataset in `data/farm_dataset.csv`.
- MAE and risk accuracy are computed in the analytics service and surfaced in the analytics UI.
- The current validation story is best framed as **prototype benchmarking on modeled agricultural records**, not field-deployed production validation.

## Core Capabilities

### 1. Crop Intelligence
- Upload a leaf image and analyze it through the crop diagnosis flow.
- Generate disease, confidence, severity, health, and recovery guidance.
- Open a full result report with risk, yield, sustainability, and loan-readiness signals.

### 2. Weighted Risk Formula
- Combines disease confidence, severity, and weather context.
- Supports transparent risk outputs and live weather impact reasoning.
- Returns both user-facing summaries and structured backend payloads.

### Example Risk Breakdown

```text
Risk Score: 72 (Medium)

+ Crop Health: +18
+ Yield Stability: +12
- Weather Volatility: -10
- Market Fluctuation: -8
+ Past Performance: +20

Confidence: 0.87

Explanation:
Moderate risk due to weather instability and market uncertainty.
```

This explainability layer is one of the project’s strongest product features because it makes the model output reviewable by both operators and finance-facing stakeholders.

### 3. Yield Prediction
- Uses rule-based yield estimation tied to crop type and risk score.
- Reports projected yield and estimated loss.

### 4. Trust / Credit Readiness
- Converts farm-performance signals into a trust score.
- Maps trust results into eligibility-style summaries for lending scenarios.
- Supports pending application workflows and farmer detail views.

### 5. Live Weather Overlay
- Fetches current weather from OpenWeather.
- Computes a bounded weather impact from temperature, humidity, and wind.
- Shows the current weather effect on risk in the dashboard.

### 6. Farmer Dashboard
- Displays current risk, crop insight, yield trend, portfolio mix, and recommendations.
- Merges stored farmer data with live weather context.

### 7. 🧠 AI Assistant (Context-Aware)
- Answers queries using live farm data.
- Explains risk, yield, and trust decisions in user-facing language.
- Acts as an interface layer over the system pipeline rather than a generic chatbot.
- Uses the farmer’s latest dashboard snapshot instead of generic canned chat behavior.

## Product Walkthrough

### Public / Entry Experience
- Landing page
- Login / signup

### Protected App Experience
- `/dashboard` — overview, live risk, weather, and farm intelligence
- `/upload` — crop intelligence / diagnosis workflow
- `/result/:id` — analysis result view
- `/trust-score` — trust and finance view
- `/chat` — context-aware assistant
- `/analytics` — district / state / national intelligence views
- `/profile` — farmer profile
- `/applications` — pending loan-style application view

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- i18next / react-i18next
- Lucide React
- Supabase JS client

### Backend
- Node.js
- Express
- Supabase
- Axios
- Multer
- Sharp
- UUID

### AI / Decision Layer
- TensorFlow.js
- MobileNet
- Rule-based risk engine
- Rule-based yield logic
- Trust / credit scoring logic

### Data
- Supabase-backed application data
- Local CSV dataset for analytics / benchmarking flows

## Architecture

AgriMitra 360 follows a modular flow:

`Farmer input -> crop analysis -> risk computation -> yield projection -> trust scoring -> recommendations -> dashboard / assistant / finance views`

### System Diagram

```text
                +----------------------+
                |   Farmer / Operator  |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |  React Frontend App  |
                |  Dashboard / Upload  |
                |  Chat / Analytics    |
                +----------+-----------+
                           |
                           v
                +----------------------+
                |   Express API Layer  |
                | /analyze /chat       |
                | /analytics /weather  |
                +----------+-----------+
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
 +----------------+ +----------------+ +------------------+
 | AI Inference   | | Risk / Yield   | | Weather Service  |
 | TensorFlow.js  | | Trust Engines  | | OpenWeather API  |
 +----------------+ +----------------+ +------------------+
          |                |                |
          +----------------+----------------+
                           |
                           v
                +----------------------+
                |  Supabase + Dataset  |
                | farmers, reports,    |
                | credit, chat, stats  |
                +----------------------+
```

### Backend Modules
- `server/src/services/analysisService.js` orchestrates the main analysis pipeline.
- `server/src/services/weather.service.js` fetches and normalizes live weather.
- `server/src/services/weatherImpact.service.js` computes explainable weather risk deltas.
- `server/src/services/chatService.js` powers the assistant layer.
- `server/src/services/analyticsService.js` supports aggregated analytics views.

### AI Modules
- `ai/crop-intelligence/` contains inference and TensorFlow-facing logic.
- `ai/risk-engine/` contains explainable risk logic.
- `ai/yield-prediction/` contains rule-based yield estimation.
- `ai/trust-engine/` contains trust / finance logic.

### Frontend Modules
- `client/src/pages/` contains major app views.
- `client/src/components/` contains dashboard, result, chat, and upload UI pieces.
- `client/src/services/` maps backend data into frontend-friendly contracts.

## API Surface

The backend currently exposes routes across analysis, analytics, chat, farmers, risk, and weather.

### Key Endpoints
- `POST /api/analyze`
  Analyze a crop image and return structured diagnosis, risk, yield, trust, and recommendation data.

- `GET /api/analysis/:id`
  Fetch a previously stored analysis result.

- `GET /api/v1/analytics`
  Analytics summary endpoints for broader agricultural intelligence.

- `POST /api/v1/chat`
  Context-aware assistant quick chat.

- `GET /api/v1/farmers/:farmerId/details`
  Farmer profile plus recent crop reports and credit snapshot.

- `GET /api/v1/weather/current?location=Guntur`
  Live weather snapshot with structured risk impact output.

## Repository Structure

```text
agri-360/
├─ ai/                  # crop intelligence, risk, trust, yield logic
├─ client/              # React + Vite frontend
├─ server/              # Express backend
├─ database/            # schema, migrations, setup docs
├─ data/                # CSV dataset
├─ docs/                # supporting docs
└─ scripts/             # utility scripts
```

## Screenshot Assets

The root README now embeds the main recruiter-facing visuals directly.

Current image set in `docs/screenshots/`:

```text
docs/screenshots/
├─ dashboard.png
├─ result-page.png
├─ chat.png
├─ yield-vs-actual.png
└─ risk-distribution.png
```

Use `docs/screenshots/README.md` for capture guidance and future asset refresh notes.

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- Supabase project
- OpenWeather API key for live weather features

### 1. Clone and install

```bash
git clone https://github.com/your-username/agrimitra-360.git
cd agri-360
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Configure environment

The checked-in `.env.example` is minimal, so in practice you will likely want a root `.env` with values like:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENWEATHER_API_KEY=your_openweather_key
USE_TENSORFLOW=true
USE_LLM=false
LLM_API_URL=
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini
PORT=5000
```

Notes:
- `server/src/config/supabase.js` reads the root `.env`.
- frontend API calls are proxied through Vite from `/api` to `http://localhost:5000`.

### 3. Set up the database

Run the full schema or migrations in Supabase / PostgreSQL:

```bash
psql -d your_database -f database/schema.sql
```

or

```bash
psql -d your_database -f database/migrations/run_migrations.sql
```

See [database/README.md](database/README.md) for more detail.

### 4. Start the app

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

### 5. Open locally

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## Demo Flow For Reviewers

If you are showing this project to recruiters, judges, or collaborators, this is the cleanest path:

1. Open the landing page and sign in.
2. Go to `Crop Intelligence` and upload a sample image.
3. Run diagnosis and open the full report.
4. Show the dashboard with live weather impact.
5. Open the chat assistant and ask about risk or loan eligibility.
6. Visit analytics to show district/state/national intelligence context.

This sequence makes the project feel like a complete product system rather than a single ML demo screen.

## Elevator Pitch

AgriMitra 360 is a decision-support prototype for agricultural intelligence and credit readiness. It combines crop diagnosis, explainable risk, yield forecasting, live weather impact, and trust scoring into a single workflow so a farmer or lender can move from “What’s happening in the field?” to “What action should we take next?” without switching systems.

## Current Strengths

- Strong product framing across agriculture + finance
- Good modular separation between AI logic, backend orchestration, and frontend presentation
- Real weather-aware risk extension
- Context-grounded assistant
- Supabase-backed data flows

## Known Gaps / Reality Check

- Test coverage is still light.
- Some docs are placeholders and have lagged behind implementation.
- Environment setup is more manual than ideal.
- There are a few legacy / overlapping routes and pages from iterative development.
- This is best described as a strong prototype or hackathon-to-portfolio build, not a production-hardened platform.

## Recommended Next Upgrades

- Add automated tests for analysis, weather impact, and result contract mapping.
- Expand `.env.example` to reflect the real required variables.
- Add a short GIF walkthrough showing upload → result → dashboard → chat flow.
- Add seed + bootstrap scripts for a faster first run.
- Add CI for frontend build and backend smoke checks.

## Contributing

Contributions are welcome. A good contribution flow is:

1. Fork the repo
2. Create a feature branch
3. Make focused changes
4. Include testing notes
5. Open a pull request with a clear summary

## License

This project is licensed under the MIT License.

## Acknowledgment

Built to explore how AI can support farmer decision-making, crop recovery planning, and finance-readiness in one workflow.
