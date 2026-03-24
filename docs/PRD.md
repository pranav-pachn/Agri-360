<!-- 
╔══════════════════════════════════════════════════════════════════════════╗
║                    AI MODEL CONTEXT BLOCK                                ║
║  This document is designed to be used as context for any AI model.       ║
║  Read the CONTEXT_PROTOCOL section below before processing.              ║
╚══════════════════════════════════════════════════════════════════════════╝
-->

# CONTEXT_PROTOCOL

> **FOR AI MODELS**: This section tells you what this document is, how to read it, and how to use it. Do NOT skip this section.

## What Is This Document?

This is the **single source of truth** for the **AgriMitra 360** project — an AI-Powered Agricultural Intelligence & Financial Trust System. It contains everything an AI model needs to understand, build, debug, extend, or discuss any part of this project.

> **⚠️ HACKATHON CONSTRAINT**: This project must be completed in **24 hours**. All APIs, models, databases, and hosting must be **100% FREE**. Every section reflects this constraint. Do NOT suggest paid services.

## How To Read This Document

1. **Start here** — Read this `CONTEXT_PROTOCOL` section to understand the document structure
2. **Check `PROJECT_STATE`** — Understand the current phase and what has been done so far
3. **Read `QUICK_IDENTITY`** — Get the 30-second summary of the entire project
4. **Read `MODULE_REGISTRY`** — Understand all components and their relationships
5. **Dive into the relevant section** — Use the Table of Contents to jump to the area you need

## How To Use This Document

| If you are asked to... | Read these sections first |
|------------------------|--------------------------|
| **Build the frontend** | §4 Product Overview → §12 UI Requirements → §8 Tech Stack → §11 API Specs |
| **Build the backend API** | §7 Architecture → §8 Tech Stack → §11 API Specs → §9 Data Architecture |
| **Train or modify AI models** | §10 AI/ML Specs → §6.1 Crop Intelligence → §6.2 Yield Prediction |
| **Implement the Trust Score** | §6.4 AgriCredit Engine → §3 Bridge Concept → §6.5 XAI Dashboard |
| **Write database migrations** | §9 Data Architecture → §6 all feature specs (for field requirements) |
| **Design the system architecture** | §7 Architecture → §14 Scalability → §17 Deployment |
| **Answer questions about the project** | §1 Executive Summary → §3 Bridge Concept → §4 Product Overview |
| **Debug or fix issues** | §8 Tech Stack → §7 Architecture → §11 API Specs → relevant §6.x feature |
| **Write tests** | §11 API Specs → §6 Feature Specs (acceptance criteria) → §14 Performance |
| **Prepare competition/pitch content** | §1 Summary → §2 Problem → §3 Bridge → §15 Competitive Analysis → §18 KPIs |
| **Add a new feature** | §3 Bridge Concept → §7 Architecture → §9 Data Architecture → §8 Tech Stack |
| **Assess security/compliance** | §13 Security → §6.5 XAI/Regulatory → §16 Risk Analysis |

## Document Conventions

- **`[BRIDGE]`** markers indicate components that form the core agriculture-to-finance bridge
- **`P0`** = Must have (launch blocker), **`P1`** = Should have (next release), **`P2`** = Nice to have
- **Requirement IDs** follow the pattern `XX-NN` where XX = module code, NN = sequence number
- **All formulas are production-ready** — implement them exactly as written
- **JSON schemas are contracts** — API responses must match these structures

---

# PROJECT_STATE

> **FOR AI MODELS**: Check this section FIRST to know where the project currently stands.

```yaml
project_name: AgriMitra 360
project_type: "24-HOUR HACKATHON"
constraint_budget: "$0 — ALL FREE tools, APIs, models, and hosting"
current_phase: "Phase 1 — Research & Design"
current_milestone: "PRD Complete, Pre-Development"
last_updated: "2026-03-23"
hackathon_start: "2026-03-23T00:00:00+05:30"
hackathon_end: "2026-03-24T00:00:00+05:30"

completed:
  - Market research and problem analysis
  - System architecture design
  - PRD v2.0 authoring (hackathon-scoped)
  - AI model selection (MobileNetV2 pretrained — FREE via TF Hub)
  - Trust Score formula design
  - Database schema design
  - API endpoint specification

in_progress:
  - Development environment setup

not_started:
  - Frontend (React.js via Vite — FREE)
  - Backend (Node.js + Express — FREE)
  - MobileNetV2 inference integration (pretrained model — FREE, NO training needed)
  - Yield prediction (rule-based MVP — no ML training needed)
  - Trust Score engine (weighted formula — pure code, no ML)
  - Database (Supabase FREE tier — PostgreSQL)
  - API development
  - XAI dashboard (Chart.js visualizations)
  - Demo deployment (Vercel FREE + Render FREE)
  - Quick smoke testing

deliberately_deferred_to_post_hackathon:
  - Custom model training (using pretrained only)
  - Bank integration APIs (mock/simulated)
  - PWA mobile app
  - Redis caching
  - Aadhaar eKYC integration
  - Multi-language support
  - Offline mode

blocking_decisions: []
known_risks:
  - "Free API rate limits (OpenWeatherMap: 60 calls/min — sufficient for demo)"
  - "Supabase free tier: 500MB storage, 50K row reads/month — fine for hackathon"
```

---

# QUICK_IDENTITY

> **30-second summary for any AI model entering this context.**

| Field | Value |
|-------|-------|
| **Name** | AgriMitra 360 |
| **One-liner** | AI-powered bridge between agriculture intelligence and financial credit for Indian farmers |
| **Core Metaphor** | **THE BRIDGE** — translates farm data into bankable trust scores |
| **Problem** | 47% of Indian farmers lack formal credit; banks have zero farm productivity data |
| **Solution** | CNN disease detection + yield prediction + sustainability scoring → composite Trust Score (300–900) → bank credit decisions |
| **Tech Stack** | React.js (Vite) · Node.js/Express · Supabase (FREE PostgreSQL) · MobileNetV2 (pretrained FREE) · Chart.js |
| **Target Users** | Smallholder farmers, bank loan officers, agriculture officers |
| **Key Innovation** | Replaces collateral-based lending with AI-driven agricultural credibility |
| **Hackathon Scope** | 24 hours · $0 budget · all free APIs · pretrained models only · demo-ready MVP |
| **Competition Criteria** | Innovation, Feasibility, Impact, Scalability, Presentation Clarity |
| **💰 Cost** | **ZERO. Every single tool, API, model, and host is FREE.** |

---

# MODULE_REGISTRY

> **FOR AI MODELS**: This maps every module, its dependencies, and where to find specifications.

```yaml
modules:
  - id: AUTH
    name: "Authentication & Authorization"
    type: backend
    tech: "Supabase Auth (FREE) — email/password + JWT"
    depends_on: [DATABASE]
    spec_section: "§13.1"
    api_endpoints: ["/api/v1/auth/register", "/api/v1/auth/login"]
    cost: FREE
    hackathon_note: "Supabase Auth handles JWT, sessions, and user management out-of-box — zero custom auth code needed"

  - id: CROP_INTEL
    name: "Crop Intelligence Engine"
    type: ai_inference
    tech: "MobileNetV2 PRETRAINED (TensorFlow.js — FREE from TF Hub)"
    depends_on: [DATABASE, FILE_STORAGE]
    spec_section: "§6.1"
    api_endpoints: ["/api/v1/crop/diagnose", "/api/v1/crop/history/:farmerId"]
    model_input: "224×224×3 RGB image"
    model_output: "38 disease classes + health_score (0-100)"
    bridge_role: "Pillar 1 — feeds health data into Trust Score"
    cost: FREE
    hackathon_note: "Use pretrained model from TF Hub — NO custom training. Load .h5 or use TensorFlow.js in browser for client-side inference"
    model_source: "https://tfhub.dev/google/tf2-preview/mobilenet_v2 + PlantVillage weights from Kaggle (FREE)"

  - id: YIELD_PRED
    name: "Yield Prediction Module"
    type: rule_engine
    tech: "Rule-based formula using weather + crop health (NO ML training needed)"
    depends_on: [AUTH, DATABASE, WEATHER_API, CROP_INTEL]
    spec_section: "§6.2"
    api_endpoints: ["/api/v1/yield/predict/:farmerId"]
    model_output: "predicted_yield (tons/hectare) — rule-based estimate"
    bridge_role: "Pillar 2 — feeds yield data into Trust Score"
    cost: FREE
    hackathon_note: "For 24hr hackathon, use weighted formula (crop_type_base_yield × health_factor × weather_factor × soil_factor) instead of trained ML model. Equally impressive for demo, no training time."

  - id: SUSTAINABILITY
    name: "Sustainability Scoring System"
    type: scoring_engine
    tech: "Weighted formula (6 parameters) — pure JavaScript"
    depends_on: [AUTH, DATABASE]
    spec_section: "§6.3"
    model_output: "sustainability_index (0-100)"
    bridge_role: "Pillar 3 — feeds environmental data into Trust Score"
    cost: FREE

  - id: AGRI_CREDIT
    name: "AgriCredit Engine (Trust Score) [BRIDGE HEART]"
    type: scoring_engine
    tech: "Weighted composite + business rules — pure JavaScript"
    depends_on: [CROP_INTEL, YIELD_PRED, SUSTAINABILITY, DATABASE]
    spec_section: "§6.4"
    api_endpoints: ["/api/v1/trust-score/:farmerId", "/api/v1/credit/apply"]
    model_output: "trust_score (300-900) + credit_rating + explainability_breakdown"
    bridge_role: "THE HEART OF THE BRIDGE — synthesizes all pillars into bankable score"
    cost: FREE

  - id: XAI_DASHBOARD
    name: "Explainable AI Dashboard"
    type: frontend_module
    tech: "React.js + Chart.js (FREE)"
    depends_on: [AGRI_CREDIT, AUTH]
    spec_section: "§6.5"
    api_endpoints: ["/api/v1/trust-score/:farmerId/explain"]
    bridge_role: "Makes the bridge transparent — builds trust with farmers and banks"
    cost: FREE

  - id: DATABASE
    name: "Supabase PostgreSQL"
    type: data_store
    tech: "Supabase FREE tier (PostgreSQL + REST API auto-generated)"
    spec_section: "§9.1"
    tables: [farmers, crop_diagnoses, yield_predictions, sustainability_scores, trust_scores, credit_applications]
    cost: FREE
    limits: "500MB storage, 50K row reads/month, 2 projects"

  - id: WEATHER_API
    name: "External Weather Integration"
    type: external_api
    tech: "OpenWeatherMap FREE tier (60 calls/min, no credit card)"
    spec_section: "§8.3"
    cost: FREE
    api_key_url: "https://openweathermap.org/api — sign up, get key instantly"

  - id: FILE_STORAGE
    name: "Image Storage"
    type: data_store
    tech: "Supabase Storage FREE tier (1GB)"
    spec_section: "§7.1"
    cost: FREE
```

---

# DEPENDENCY_FLOW

> **FOR AI MODELS**: Build order and data flow between modules.

```
BUILD ORDER (implement in this sequence):
  1. DATABASE        → Schema creation, Supabase models
  2. AUTH            → JWT auth middleware, user registration
  3. FILE_STORAGE    → Image upload (Multer)
  4. CROP_INTEL      → MobileNetV2 training + inference API
  5. WEATHER_API     → External API integration layer
  6. YIELD_PRED      → XGBoost/LSTM training + prediction API
  7. SUSTAINABILITY  → Scoring formula implementation
  8. AGRI_CREDIT     → Trust Score calculator (THE BRIDGE)
  9. XAI_DASHBOARD   → Explainability reports + visualizations
  10. BANK_INTEGRATION → Credit application flow

DATA FLOW (how information moves through the bridge):
  [Farmer uploads image]
       ↓
  CROP_INTEL → health_score
       ↓                        
  YIELD_PRED ← weather + soil + health_score → predicted_yield
       ↓
  SUSTAINABILITY ← farmer_practices → sustainability_index
       ↓
  AGRI_CREDIT ← all scores → TRUST_SCORE (300-900)
       ↓
  XAI_DASHBOARD → explainability_report
       ↓
  BANK_INTEGRATION → credit_decision
```

---

# DECISION_LOG

> **FOR AI MODELS**: Key architectural and design decisions already made. Do NOT contradict these unless explicitly asked to change them.

| # | Decision | Rationale | Alternatives Rejected | Cost |
|---|----------|-----------|----------------------|------|
| D1 | Supabase (PostgreSQL) over MySQL | FREE tier with auto-generated REST API, built-in auth, storage — saves hours of backend boilerplate | MySQL (needs separate hosting), Firebase (vendor lock-in), PlanetScale (rate limits) | FREE |
| D2 | Supabase (PostgreSQL) over MySQL | FREE tier with auto-generated REST API, built-in auth, storage — saves hours of backend boilerplate | MySQL (needs separate hosting), Firebase (vendor lock-in), PlanetScale (rate limits) | FREE |
| D3 | Trust Score range 300–900 | Mirrors CIBIL score range for bank familiarity | 0–100 (too simple), 0–1000 (unfamiliar) | N/A |
| D4 | Rule-based yield prediction (hackathon MVP) | No ML training needed; formula-based approach demo-able in hours. Post-hackathon upgrade to XGBoost | XGBoost (needs training data + time), LSTM (complex for 24hrs) | FREE |
| D5 | Chart.js bar charts for explainability | Simple, visual, FREE. Component-level score breakdown is sufficient for hackathon demo | SHAP (requires Python ML backend), D3.js (overkill for 24hrs) | FREE |
| D6 | React.js + Vite frontend | Fastest setup, hot reload, team skill. Vite is instant — zero config | Next.js (SSR overkill), Vue (less experience), vanilla JS (too slow to build) | FREE |
| D7 | Weighted composite for Trust Score | Transparent, auditable, pure JavaScript — no ML needed | Neural network scorer (needs training, black-box) | FREE |
| D8 | Supabase Auth (replaces custom JWT) | Zero auth code needed. Email/password + JWT handled automatically | Custom JWT (hours of work), Auth0 (paid beyond free tier), Firebase Auth (vendor lock) | FREE |
| D9 | Vercel + Render for deployment | Both have generous free tiers, instant deploy from GitHub, SSL auto | AWS (complex + paid), Heroku (no free tier), Railway (limited free) | FREE |
| D10 | OpenWeatherMap FREE tier for weather | 60 calls/min, no credit card required, instant API key | IMD API (unreliable), WeatherAPI (rate limited), AccuWeather (paid) | FREE |

---

# 🌾💰 AgriMitra 360 — Product Requirement Document (PRD)

## **AI-Powered Agricultural Intelligence & Financial Trust System**

**Tagline:** *From Crop Health to Credit Wealth.*

---

| Field               | Detail                                         |
|---------------------|-------------------------------------------------|
| **Document Version**| 2.0 (AI-Context-Ready Edition)                  |
| **Date**            | March 22, 2026                                  |
| **Author**          | Pranav / Team AgriMitra                         |
| **Status**          | Draft — National Competition Submission         |
| **Classification**  | Confidential                                    |
| **Context Version** | Optimized for AI model consumption              |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement — India's Agricultural Paradox](#2-problem-statement--indias-agricultural-paradox)
3. [Vision & Bridge Concept](#3-vision--bridge-concept)
4. [Product Overview](#4-product-overview)
5. [Target Users & Personas](#5-target-users--personas)
6. [Core Feature Specifications](#6-core-feature-specifications)
   - 6.1 Crop Intelligence Engine
   - 6.2 Yield Prediction Module
   - 6.3 Sustainability Scoring System
   - 6.4 AgriCredit Engine (Trust Score)
   - 6.5 Explainable AI Dashboard
7. [System Architecture](#7-system-architecture)
8. [Technology Stack](#8-technology-stack)
9. [Data Architecture & Pipeline](#9-data-architecture--pipeline)
10. [AI/ML Model Specifications](#10-aiml-model-specifications)
11. [API Specifications](#11-api-specifications)
12. [User Interface Requirements](#12-user-interface-requirements)
13. [Security & Privacy Requirements](#13-security--privacy-requirements)
14. [Performance & Scalability Requirements](#14-performance--scalability-requirements)
15. [Competitive Analysis](#15-competitive-analysis)
16. [Risk Analysis & Mitigation](#16-risk-analysis--mitigation)
17. [Deployment Strategy](#17-deployment-strategy)
18. [Success Metrics & KPIs](#18-success-metrics--kpis)
19. [Roadmap & Milestones](#19-roadmap--milestones)
20. [Appendices](#20-appendices)

---

## 1. Executive Summary

**AgriMitra 360** is an end-to-end AI-powered platform that serves as the **intelligence bridge** between India's agricultural sector and its financial ecosystem. Traditional lending models fail smallholder farmers because they rely on collateral and credit history — assets most farmers don't possess. Meanwhile, rich agricultural data (crop health, yield patterns, sustainability practices) goes completely unused in credit decisions.

> **AgriMitra 360 builds the missing intelligence bridge between farms and finance.**

The platform integrates:
- **Computer Vision** for real-time crop disease detection
- **Predictive Analytics** for yield forecasting
- **Sustainability Scoring** for environmental compliance
- **AI-driven Credit Scoring** that replaces traditional collateral with intelligent agricultural credibility

This **bridge** transforms raw agricultural data into actionable financial trust — enabling banks, NBFCs, and microfinance institutions to make informed lending decisions for India's 150 million+ farming households.

---

## 2. Problem Statement — India's Agricultural Paradox

### 2.1 The Paradox

India is the **world's second-largest agricultural producer**, contributing ~18% of GDP and employing ~42% of the workforce. Yet:

| Metric                          | Reality                                    |
|---------------------------------|--------------------------------------------|
| Farmers without formal credit   | ~47% of agricultural households             |
| Crop loss due to late detection  | 20–35% of annual harvest                   |
| Farmer suicides (2019–2023)     | 10,000+ annually, largely debt-related      |
| Digital agriculture penetration  | < 5% of smallholder farmers                |
| Banks rejecting agri-loans      | ~60% due to lack of collateral/credit data  |

### 2.2 Root Causes

1. **Information Asymmetry** — Banks have zero visibility into actual farm productivity
2. **No Credibility Proxy** — No system converts farming behavior into financial trustworthiness
3. **Late Disease Detection** — Farmers identify diseases visually, often too late
4. **No Yield Forecasting** — Lending happens without understanding expected returns
5. **Sustainability Blindness** — No measurement of environmental farming practices

### 2.3 The Cost of Inaction

> "India feeds the nation — but struggles to fund its farmers."

Without a **bridge** between agricultural intelligence and financial decision-making, the cycle of poverty, debt, and crop loss will continue to devastate rural India.

---

## 3. Vision & Bridge Concept

### 3.1 The Bridge Metaphor

AgriMitra 360 is architecturally and conceptually a **bridge** — a structured pathway connecting two disconnected worlds:

```
┌─────────────────────────┐                           ┌─────────────────────────┐
│     AGRICULTURE         │                           │       FINANCE           │
│                         │                           │                         │
│  • Crop Health Data     │                           │  • Credit Decisions     │
│  • Yield Patterns       │    ╔═══════════════╗      │  • Loan Approvals       │
│  • Disease History      │    ║  AGRIMITRA 360 ║      │  • Risk Assessment      │
│  • Sustainability       │◄──►║   THE BRIDGE   ║◄──►  │  • Interest Rates       │
│  • Soil Conditions      │    ║               ║      │  • Insurance Pricing    │
│  • Weather Patterns     │    ╚═══════════════╝      │  • Portfolio Management │
│  • Farming Practices    │                           │  • Financial Inclusion  │
└─────────────────────────┘                           └─────────────────────────┘
          RAW DATA                 INTELLIGENCE               TRUST & ACCESS
```

### 3.2 Bridge Pillars

The **bridge** stands on four engineered pillars:

| Pillar | Function | Output |
|--------|----------|--------|
| **Pillar 1: Crop Intelligence** | Disease detection via CNN | Health Score (0–100) |
| **Pillar 2: Yield Prediction** | ML-based harvest forecasting | Expected Yield (tons/hectare) |
| **Pillar 3: Sustainability** | Environmental practice scoring | Sustainability Index (0–100) |
| **Pillar 4: AgriCredit** | Composite financial trust score | Trust Score (300–900) |

### 3.3 Core Philosophy

> **"We replace traditional collateral with intelligent agricultural credibility."**

The **bridge** doesn't just connect — it *translates*. It converts agricultural signals into financial language that banks, NBFCs, and insurance companies already understand.

---

## 4. Product Overview

### 4.1 Product Name
**AgriMitra 360** (*Mitra* = Friend in Hindi; *360* = Complete, all-around)

### 4.2 Product Type
Web-based SaaS platform with planned mobile (PWA) support

### 4.3 Core Value Proposition

AgriMitra 360 is the only platform that creates a **bridge** from crop-level intelligence to credit-level trust scoring, enabling:
- **Farmers** → Access credit they've historically been denied
- **Banks** → Reduce NPA (Non-Performing Assets) in agri-lending by up to 40%
- **Government** → Data-driven policy for agricultural subsidies and insurance

### 4.4 Key Differentiators

1. **End-to-End Bridge** — No other platform connects disease detection to credit scoring
2. **Explainable AI** — Full transparency in how trust scores are computed
3. **Lightweight Deployment** — MobileNetV2 architecture runs in resource-constrained environments
4. **Sustainability-Aware** — First platform to integrate environmental scoring into credit
5. **India-Specific** — Trained on Indian crop varieties, regional soil data, and local weather

---

## 5. Target Users & Personas

### 5.1 Primary Users

#### Persona 1: Ramu — Smallholder Farmer
| Attribute | Detail |
|-----------|--------|
| Age | 35–55 |
| Land | 1–3 hectares |
| Tech Literacy | Low (uses smartphone for WhatsApp) |
| Credit History | None |
| Pain Point | Cannot access formal loans; loses 25% crops to disease |
| Need | Disease detection, credit access |

#### Persona 2: Priya — Bank Loan Officer
| Attribute | Detail |
|-----------|--------|
| Age | 28–40 |
| Organization | Regional bank / NBFC |
| Pain Point | No data to assess farmer creditworthiness; 60% loan rejection rate |
| Need | AI-generated trust scores with explainable reasoning |

#### Persona 3: District Agriculture Officer
| Attribute | Detail |
|-----------|--------|
| Organization | State Agriculture Department |
| Pain Point | No real-time visibility into crop health across the district |
| Need | Aggregated disease surveillance and yield forecasting dashboards |

### 5.2 Secondary Users

- **Insurance Companies** — Use sustainability and yield data for crop insurance pricing
- **Agri-Input Companies** — Target recommendations based on disease and soil data
- **Researchers / NGOs** — Access anonymized datasets for agricultural studies

---

## 6. Core Feature Specifications

### 6.1 Crop Intelligence Engine

> *"We use transfer learning to reduce training time while maintaining high accuracy — making the model lightweight and deployable in rural environments."*

#### 6.1.1 Overview
Real-time crop disease detection using deep learning computer vision, powered by **MobileNetV2** trained on the **PlantVillage** dataset.

#### 6.1.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| CI-01 | Accept image uploads (JPEG/PNG, max 10MB) via web interface | P0 |
| CI-02 | Classify plant diseases across 38 categories with ≥92% accuracy | P0 |
| CI-03 | Return diagnosis within 3 seconds on standard hardware | P0 |
| CI-04 | Provide confidence score (0–100%) for each diagnosis | P0 |
| CI-05 | Display disease description, symptoms, and recommended treatment | P0 |
| CI-06 | Support offline inference via cached model (PWA) | P1 |
| CI-07 | Log all diagnoses to farmer's historical health record | P0 |
| CI-08 | Support batch image upload (up to 10 images per request) | P1 |
| CI-09 | Provide localized results in Hindi, Marathi, Telugu, Tamil | P2 |

#### 6.1.3 Supported Crops (Phase 1)

| Crop | Disease Count | Source Dataset |
|------|---------------|----------------|
| Tomato | 10 diseases | PlantVillage |
| Potato | 3 diseases | PlantVillage |
| Corn (Maize) | 4 diseases | PlantVillage |
| Apple | 4 diseases | PlantVillage |
| Grape | 4 diseases | PlantVillage |
| Rice | 4 diseases | Custom + IRRI |
| Wheat | 3 diseases | Custom + CIMMYT |
| Cotton | 4 diseases | Custom |
| Sugarcane | 2 diseases | Custom |

#### 6.1.4 Output Schema

```json
{
  "farmer_id": "FM-2026-00451",
  "image_id": "IMG-20260322-001",
  "timestamp": "2026-03-22T10:30:00Z",
  "crop": "Tomato",
  "diagnosis": {
    "disease": "Early Blight",
    "confidence": 94.7,
    "severity": "Moderate",
    "health_score": 62
  },
  "recommendations": [
    {
      "type": "Fungicide",
      "product": "Mancozeb 75% WP",
      "dosage": "2.5g/L water",
      "frequency": "Every 7 days for 3 weeks"
    },
    {
      "type": "Cultural Practice",
      "action": "Remove infected lower leaves",
      "urgency": "Immediate"
    }
  ],
  "bridge_impact": {
    "health_score_change": -18,
    "trust_score_impact": "Minor negative — recoverable with treatment compliance"
  }
}
```

---

### 6.2 Yield Prediction Module

#### 6.2.1 Overview
ML-based yield forecasting that combines crop health history, weather data, soil quality, and historical yield data to predict expected harvest output.

#### 6.2.2 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| YP-01 | Predict yield (tons/hectare) for supported crops per season | P0 |
| YP-02 | Integrate real-time weather data (IMD API) | P0 |
| YP-03 | Factor in soil quality data (pH, NPK levels) | P0 |
| YP-04 | Use crop health history from Disease Detection module | P0 |
| YP-05 | Provide confidence interval (±range) with predictions | P1 |
| YP-06 | Display yield trend over past 3 seasons | P1 |
| YP-07 | Generate alerts for predicted yield drops > 20% | P0 |

#### 6.2.3 Model Inputs

| Input Feature | Source | Update Frequency |
|---------------|--------|------------------|
| Historical yield data | Government records / farmer input | Seasonal |
| Crop health scores | Disease Detection module | Real-time |
| Soil parameters (pH, N, P, K) | Soil testing reports / IoT sensors | Monthly |
| Weather data (temp, rainfall, humidity) | IMD API / OpenWeather | Daily |
| Irrigation type | Farmer profile | Static |
| Fertilizer usage | Farmer input | Monthly |
| Crop variety & planting date | Farmer input | Seasonal |

#### 6.2.4 Algorithm (Hackathon MVP — Rule-Based, FREE, No Training)

> **⚠️ HACKATHON SCOPE**: For the 24-hour build, yield prediction uses a **rule-based formula** (no ML training needed). This is upgradeable to XGBoost post-hackathon.

```javascript
// Hackathon MVP — Rule-Based Yield Prediction
const BASE_YIELDS = { // tons/hectare (India averages)
  tomato: 25, potato: 22, rice: 4, wheat: 3.5, corn: 5,
  cotton: 1.8, sugarcane: 70, apple: 12, grape: 20
};

function predictYield(crop, healthScore, weatherData, soilQuality) {
  const baseYield = BASE_YIELDS[crop] || 10;
  const healthFactor = healthScore / 100;           // 0.0 – 1.0
  const weatherFactor = calculateWeatherFactor(weatherData); // 0.5 – 1.2
  const soilFactor = soilQuality / 100;              // 0.0 – 1.0
  
  const predicted = baseYield * healthFactor * weatherFactor * soilFactor;
  return {
    predicted_yield: Math.round(predicted * 100) / 100,
    unit: "tons/hectare",
    confidence: "rule-based estimate"
  };
}
```

- **Post-Hackathon Upgrade Path:** Replace with XGBoost + LSTM ensemble (see original design)
- **Data Source for Demo:** Hardcoded Indian crop averages from Government Open Data

---

### 6.3 Sustainability Scoring System

#### 6.3.1 Overview
A quantitative environmental scoring system that evaluates farming practices against sustainability benchmarks. This score forms a critical **bridge** component — linking environmental responsibility to financial trustworthiness.

#### 6.3.2 Scoring Parameters

| Parameter | Weight | Score Range | Data Source |
|-----------|--------|-------------|-------------|
| Pesticide Usage | 20% | 0–100 | Farmer input + purchase records |
| Water Efficiency | 20% | 0–100 | Irrigation type + weather correlation |
| Crop Rotation Practice | 15% | 0–100 | Historical crop selection data |
| Organic Input Usage | 15% | 0–100 | Input purchase verification |
| Soil Health Maintenance | 15% | 0–100 | Soil test trends over time |
| Carbon Footprint Estimate | 15% | 0–100 | Calculated from inputs |

#### 6.3.3 Sustainability Index Formula

```
Sustainability_Index = Σ (Parameter_Score × Weight) 

Where:
  - Each Parameter_Score ∈ [0, 100]
  - Sustainability_Index ∈ [0, 100]
  
Rating Scale:
  85–100 → Excellent (Green Badge)
  70–84  → Good (Blue Badge)
  50–69  → Average (Yellow Badge)
  30–49  → Below Average (Orange Badge)
  0–29   → Poor (Red Badge)
```

---

### 6.4 AgriCredit Engine — Trust Score *(Game Changer)*

> **"We replace traditional collateral with intelligent agricultural credibility."**

#### 6.4.1 Overview
The AgriCredit Engine is the **heart of the bridge**. It synthesizes all agricultural intelligence into a single, bankable **Trust Score** — a credit-like score designed specifically for farmers who lack traditional credit history.

#### 6.4.2 Trust Score Architecture

```
╔══════════════════════════════════════════════════════════════╗
║                    AGRIMITRA TRUST SCORE                     ║
║                      Range: 300–900                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ║
║  │ Crop Health   │  │    Yield     │  │Sustainability│        ║
║  │   Score       │  │  Prediction  │  │    Index     │        ║
║  │  Weight: 30%  │  │  Weight: 25% │  │  Weight: 20% │        ║
║  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        ║
║         │                 │                 │                 ║
║         └─────────────────┼─────────────────┘                 ║
║                           │                                   ║
║                    ┌──────┴───────┐                           ║
║                    │  TRUST SCORE │                           ║
║                    │   ENGINE     │                           ║
║                    └──────┬───────┘                           ║
║                           │                                   ║
║  ┌──────────────┐  ┌──────┴───────┐  ┌──────────────┐        ║
║  │  Historical   │  │  Behavioral  │  │   External   │        ║
║  │  Compliance   │  │   Patterns   │  │ Verification │        ║
║  │  Weight: 10%  │  │  Weight: 10% │  │  Weight: 5%  │        ║
║  └──────────────┘  └──────────────┘  └──────────────┘        ║
╚══════════════════════════════════════════════════════════════╝
```

#### 6.4.3 Trust Score Components

| Component | Weight | Description | Score Range |
|-----------|--------|-------------|-------------|
| **Crop Health Score** | 30% | Average health score across last 4 seasons | 0–100 |
| **Yield Performance** | 25% | Actual vs predicted yield ratio | 0–100 |
| **Sustainability Index** | 20% | Environmental practices score | 0–100 |
| **Historical Compliance** | 10% | Past loan repayment + advisory compliance | 0–100 |
| **Behavioral Patterns** | 10% | Platform engagement, data consistency | 0–100 |
| **External Verification** | 5% | Third-party data cross-referencing | 0–100 |

#### 6.4.4 Trust Score Formula

```
Raw_Score = (0.30 × CropHealth) + (0.25 × YieldPerformance) + 
            (0.20 × SustainabilityIndex) + (0.10 × HistoricalCompliance) + 
            (0.10 × BehavioralPatterns) + (0.05 × ExternalVerification)

Trust_Score = 300 + (Raw_Score × 6)

Where:
  - Raw_Score ∈ [0, 100]
  - Trust_Score ∈ [300, 900]
  
Credit Rating:
  750–900 → Excellent (Pre-approved for loans up to ₹5L)
  650–749 → Good (Eligible for standard agri-loans)
  550–649 → Fair (Eligible with higher interest / co-signer)
  450–549 → Below Average (Micro-loans only)
  300–449 → Poor (Financial literacy program enrollment)
```

#### 6.4.5 Bank Integration API Output

```json
{
  "farmer_id": "FM-2026-00451",
  "trust_score": 742,
  "credit_rating": "Good",
  "score_breakdown": {
    "crop_health": { "raw": 78, "weighted": 23.4 },
    "yield_performance": { "raw": 85, "weighted": 21.25 },
    "sustainability": { "raw": 72, "weighted": 14.4 },
    "historical_compliance": { "raw": 90, "weighted": 9.0 },
    "behavioral_patterns": { "raw": 65, "weighted": 6.5 },
    "external_verification": { "raw": 80, "weighted": 4.0 }
  },
  "recommendation": {
    "max_loan_amount": 350000,
    "suggested_interest_rate": "8.5%",
    "repayment_term_months": 18,
    "risk_category": "Low-Medium"
  },
  "explainability_report_url": "/api/v1/explain/FM-2026-00451"
}
```

---

### 6.5 Explainable AI (XAI) Dashboard

> **"Black-box AI fails in rural finance. Transparent AI builds trust."**

#### 6.5.1 Overview
Every score, prediction, and recommendation produced by AgriMitra 360 comes with a full explainability report — critical for regulatory compliance (RBI guidelines) and building trust with farmers and financial institutions.

#### 6.5.2 Explainability Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| XAI-01 | Score Decomposition | Visual breakdown of Trust Score into component contributions | P0 |
| XAI-02 | Factor Impact Chart | Bar chart showing positive/negative impact of each factor | P0 |
| XAI-03 | Natural Language Explanation | Plain-English (and Hindi) explanation of why a score was given | P0 |
| XAI-04 | "What-If" Simulator | Allow users to simulate score changes based on hypothetical inputs | P1 |
| XAI-05 | Historical Score Timeline | Track how the Trust Score has evolved over seasons | P0 |
| XAI-06 | Anomaly Flagging | Highlight unusual data patterns that affected the score | P1 |
| XAI-07 | Audit Trail | Complete log of all data inputs and model versions used | P0 |

#### 6.5.3 Regulatory Alignment

| Regulation | AgriMitra 360 Compliance |
|------------|--------------------------|
| RBI Fair Lending Guidelines | Full score explainability for every decision |
| Data Protection Bill (India) | Farmer consent for data usage; right to explanation |
| NABARD Priority Sector Norms | Designed for priority sector lending compliance |
| SEBI ESG Guidelines | Sustainability scoring aligns with ESG reporting |

---

## 7. System Architecture

### 7.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   React.js Web    │  │   PWA Mobile     │  │  Bank Portal     │          │
│  │   Application     │  │   (Phase 2)      │  │  (API Consumer)  │          │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘          │
└───────────┼──────────────────────┼──────────────────────┼───────────────────┘
            │                      │                      │
            └──────────────────────┼──────────────────────┘
                                   │
                            ┌──────┴──────┐
                            │  API GATEWAY │
                            │  (Nginx)     │
                            └──────┬──────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────────┐
│                          SERVER LAYER                                       │
│                                  │                                          │
│  ┌───────────────────────────────┼────────────────────────────────────────┐ │
│  │              Node.js + Express.js Backend                              │ │
│  │                                                                        │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │ │
│  │  │Auth      │ │Crop API  │ │Yield API │ │Credit API│ │XAI API   │   │ │
│  │  │Service   │ │Service   │ │Service   │ │Service   │ │Service   │   │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │              AI/ML Inference Layer                                     │ │
│  │                                                                        │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                   │ │
│  │  │ MobileNetV2   │ │ XGBoost      │ │ Trust Score   │                   │ │
│  │  │ (Disease)     │ │ (Yield)      │ │ Calculator    │                   │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────────┐
│                          DATA LAYER                                         │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Supabase   │  │   Supabase   │  │   Supabase   │  │               │   │
│  │  (PostgreSQL)│  │  (Auth)      │  │  (Storage)   │  │               │   │
│  │               │  │              │  │              │  │               │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

### 7.2 Microservice Decomposition (Phase 2)

| Service | Responsibility | Communication |
|---------|---------------|---------------|
| Auth Service | JWT-based authentication, role management | REST |
| Crop Intelligence Service | Disease detection inference | REST + Queue |
| Yield Prediction Service | Yield forecasting computations | REST |
| Credit Engine Service | Trust score calculation | REST |
| Notification Service | Alerts, recommendations push | WebSocket + Email |
| Analytics Service | Dashboard aggregation and reporting | REST |

---

## 8. Technology Stack

### 8.1 Core Stack (ALL FREE — $0 Total Cost)

| Layer | Technology | Cost | Justification |
|-------|------------|------|---------------|
| **Frontend** | React.js 18+ (Vite) | 🆓 FREE | Fastest setup, hot reload, massive ecosystem |
| **Backend** | Node.js 20 LTS + Express.js 4.x | 🆓 FREE | Non-blocking I/O, JS full-stack |
| **Database** | Supabase (PostgreSQL) | 🆓 FREE tier | Auto-generated REST API, built-in auth, 500MB storage, 3 tables: farmers, crop_reports, credit_scores |
| **AI Model** | MobileNetV2 pretrained (TensorFlow.js) | 🆓 FREE | Pretrained weights from TF Hub + Kaggle. No training needed |
| **Charts** | Chart.js 4.x | 🆓 FREE | Simple, beautiful data visualizations |
| **Frontend Hosting** | Vercel | 🆓 FREE tier | Instant deploy from GitHub, SSL auto |
| **Backend Hosting** | Render | 🆓 FREE tier | Node.js hosting, auto-deploy from GitHub |

### 8.2 Supporting Technologies (ALL FREE)

| Technology | Purpose | Cost |
|------------|---------|------|
| Supabase Auth | Authentication (email/password + JWT) | 🆓 FREE |
| Supabase Storage | Image upload & storage (1GB free) | 🆓 FREE |
| @supabase/supabase-js | Supabase client library | 🆓 FREE |
| TensorFlow.js | Run MobileNetV2 in browser/Node.js | 🆓 FREE |
| Chart.js | Dashboard visualizations | 🆓 FREE |
| React Router v6 | Client-side routing | 🆓 FREE |
| Axios | HTTP client for API calls | 🆓 FREE |
| GitHub | Version control & CI/CD | 🆓 FREE |
| Vite | Build tool (instant dev server) | 🆓 FREE |

### 8.3 External API Integrations (ALL FREE — No Credit Card Required)

| API | Provider | Purpose | Free Tier Limits | Signup URL |
|-----|----------|---------|-----------------|------------|
| Weather Data | OpenWeatherMap | Real-time weather for yield prediction | 60 calls/min, no CC | https://openweathermap.org/api |
| Soil Data | SoilGrids (ISRIC) | Soil composition parameters | Unlimited, open data | https://rest.isric.org |
| Crop Prices | Data.gov.in Open API | MSP and market price data | Unlimited, open data | https://data.gov.in |
| Geocoding | OpenWeatherMap Geocoding | Location → lat/lon conversion | Included in free tier | Same as weather API |

> **Deferred to Post-Hackathon (Paid/Complex):** Aadhaar eKYC (UIDAI), UPI/Razorpay payments, IMD premium API

---

## 9. Data Architecture & Pipeline

### 9.1 Database Schema (Key Tables)

**Supabase Implementation** - Three core tables with precise data types and practical indexes:

```sql
-- Farmers Table (User Registration & Profile)
CREATE TABLE farmers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index: location (for filtering)

-- Crop Reports Table (Disease Analysis)
CREATE TABLE crop_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    image_url TEXT,
    disease TEXT,
    confidence DECIMAL(5,4), -- AI precision: 0.9234
    risk_score DECIMAL(5,4),
    crop_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Indexes: farmer_id, created_at, location, crop_type

-- Credit Scores Table (Financial Data)
CREATE TABLE credit_scores (
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE PRIMARY KEY,
    trust_score INTEGER NOT NULL CHECK (trust_score >= 300 AND trust_score <= 900),
    credit_grade TEXT,
    loan_amount DECIMAL(12,2), -- Financial precision
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Indexes: farmer_id, created_at
```

**Key Features:**
- **DECIMAL(5,4)** for AI confidence scores (high precision)
- **DECIMAL(12,2)** for financial amounts (no FLOAT errors)
- **Foreign Key Relationships** with CASCADE DELETE
- **Practical Indexes** on frequently filtered fields
- **No over-engineering** - intentional, practical design

### 9.2 Data Flow Pipeline

```
[Image Upload] → [Preprocessing] → [MobileNetV2 Inference] → [Diagnosis Storage]
                                                                    │
[Weather API] ──┐                                                   │
[Soil Data] ────┤── [Feature Engineering] → [XGBoost Yield Model] ──┤
[Farm History] ─┘                                                   │
                                                                    │
[All Scores] ──────────────────────────────────────── [Trust Score Calculator]
                                                           │
                                                    [Explainability Engine]
                                                           │
                                                    [Bank API / Dashboard]
```

---

## 10. AI/ML Model Specifications

### 10.1 Disease Detection — MobileNetV2

| Parameter | Value |
|-----------|-------|
| **Architecture** | MobileNetV2 (ImageNet pre-trained) |
| **Transfer Learning** | Fine-tuned on PlantVillage + custom Indian crop data |
| **Input Size** | 224 × 224 × 3 (RGB) |
| **Output** | 38 disease classes + 1 healthy class |
| **Training Data** | 87,000+ labeled images |
| **Validation Accuracy** | ≥ 92% |
| **Inference Time** | < 500ms on CPU, < 100ms on GPU |
| **Model Size** | ~14 MB (TF Lite quantized) |
| **Optimization** | Post-training quantization (INT8) for mobile |

### 10.2 Yield Prediction — Rule-Based (Hackathon MVP)

| Parameter | Value |
|-----------|-------|
| **Type** | Rule-based weighted formula (NO ML training) |
| **Inputs** | Crop type, health score, weather data, soil quality |
| **Output** | Predicted yield (tons/hectare) |
| **Data Source** | Hardcoded Indian crop averages (Government Open Data) |
| **Cost** | 🆓 FREE — pure JavaScript, no training infrastructure |
| **Post-Hackathon Upgrade** | XGBoost + LSTM ensemble |

### 10.3 Trust Score — Weighted Composite + Rule Engine

| Parameter | Value |
|-----------|-------|
| **Type** | Weighted scoring + business rules (pure JavaScript) |
| **Components** | 6 sub-scores (see Section 6.4) |
| **Range** | 300–900 |
| **Recalculation** | On-demand per API call |
| **Explainability** | Component-level bar chart breakdown via Chart.js |
| **Cost** | 🆓 FREE — no ML, no external service |

---

## 11. API Specifications

### 11.1 REST API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register farmer/bank user | Public |
| POST | `/api/v1/auth/login` | Login & get JWT | Public |
| POST | `/api/v1/crop/diagnose` | Upload image for disease detection | JWT |
| GET | `/api/v1/crop/history/:farmerId` | Get past diagnoses | JWT |
| GET | `/api/v1/yield/predict/:farmerId` | Get yield prediction | JWT |
| GET | `/api/v1/sustainability/:farmerId` | Get sustainability score | JWT |
| GET | `/api/v1/trust-score/:farmerId` | Get current trust score | JWT |
| GET | `/api/v1/trust-score/:farmerId/explain` | Get explainability report | JWT |
| POST | `/api/v1/credit/apply` | Submit credit application | JWT |
| GET | `/api/v1/credit/status/:applicationId` | Check application status | JWT |
| GET | `/api/v1/dashboard/farmer/:farmerId` | Farmer dashboard data | JWT |
| GET | `/api/v1/dashboard/bank/:bankId` | Bank dashboard data | JWT |
| GET | `/api/v1/admin/analytics` | Admin analytics | JWT (Admin) |

### 11.2 Response Format Standard

```json
{
  "status": "success | error",
  "code": 200,
  "data": { },
  "meta": {
    "timestamp": "2026-03-22T10:30:00Z",
    "version": "1.0.0",
    "bridge_module": "crop-intelligence"
  },
  "errors": []
}
```

---

## 12. User Interface Requirements

### 12.1 Design Principles

1. **Simplicity First** — Farmers with low digital literacy must be able to navigate
2. **Visual Data** — Scores, charts, and color-coded indicators over raw numbers
3. **Bilingual** — English + Hindi (Phase 1); regional languages (Phase 2)
4. **Responsive** — Desktop-first with mobile-responsive breakpoints
5. **Accessibility** — WCAG 2.1 AA compliance target

### 12.2 Key Screens

| Screen | User | Key Elements |
|--------|------|--------------|
| **Login / Register** | All | Phone OTP + Password, Role selection |
| **Farmer Dashboard** | Farmer | Health Score card, Trust Score gauge, Quick Upload, Alerts |
| **Crop Diagnosis** | Farmer | Camera/Upload → Result → Recommendation |
| **Trust Score Detail** | Farmer/Bank | Score gauge, Component breakdown, Timeline |
| **What-If Simulator** | Farmer | Sliders for "if I improve X, score becomes Y" |
| **Bank Dashboard** | Bank Officer | Farmer portfolio, Risk distribution, Pending applications |
| **Loan Application** | Farmer | Auto-populated from Trust Score, simple form |
| **Admin Analytics** | Admin | District-level heatmaps, Disease outbreak tracker, Yield forecasts |

### 12.3 Visual Design System

| Element | Specification |
|---------|---------------|
| **Primary Color** | #2E7D32 (Agricultural Green) |
| **Secondary Color** | #1565C0 (Financial Blue) |
| **Accent Color** | #FF8F00 (Warning Amber) |
| **Bridge Visual** | Green→Blue gradient where agriculture meets finance |
| **Typography** | Inter (headings), Roboto (body) |
| **Score Visualization** | Radial gauge for Trust Score, bar charts for breakdowns |
| **Health Indicators** | Color-coded cards: Green (healthy), Yellow (warning), Red (critical) |

---

## 13. Security & Privacy Requirements

### 13.1 Authentication & Authorization

| Requirement | Implementation |
|-------------|----------------|
| Authentication | JWT (RS256) with refresh tokens |
| Password Storage | bcrypt (12 salt rounds) |
| Role-Based Access | Farmer, Bank Officer, Admin, Super Admin |
| Session Management | 24-hour access tokens, 7-day refresh tokens |
| Rate Limiting | 100 requests/minute per user, 1000/minute per IP |

### 13.2 Data Privacy

| Requirement | Implementation |
|-------------|----------------|
| PII Encryption | AES-256 at rest for Aadhaar, phone, name |
| Data in Transit | TLS 1.3 for all communications |
| Consent Management | Explicit opt-in for data sharing with banks |
| Right to Erasure | Farmer can request full data deletion |
| Anonymization | Research datasets stripped of PII |
| Audit Logging | All data access logged with timestamp and user ID |

### 13.3 Compliance

| Standard | Status |
|----------|--------|
| India Data Protection Bill | Compliant by design |
| RBI Digital Lending Guidelines | Score explainability built-in |
| ISO 27001 Principles | Security controls aligned |
| OWASP Top 10 | All attack vectors mitigated |

---

## 14. Performance & Scalability Requirements

### 14.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Disease Detection Inference | < 3 seconds | End-to-end from upload to result |
| Yield Prediction Response | < 2 seconds | API response time |
| Trust Score Calculation | < 5 seconds | Full recalculation |
| Dashboard Load | < 2 seconds | Time to interactive |
| API Response (95th percentile) | < 500ms | Excluding ML inference |
| Uptime | 99.5% | Monthly availability |

### 14.2 Scalability Targets

| Phase | Users | Throughput | Infrastructure |
|-------|-------|------------|----------------|
| Phase 1 (MVP) | 1,000 farmers, 50 bank users | 100 req/min | Single server |
| Phase 2 (Pilot) | 50,000 farmers, 500 bank users | 5,000 req/min | Load-balanced cluster |
| Phase 3 (Scale) | 1,000,000+ farmers, 5,000 bank users | 50,000 req/min | Kubernetes + auto-scaling |

### 14.3 Caching Strategy

**Supabase Native Caching** - Leveraging built-in PostgreSQL and Supabase capabilities:

| Data | Cache Duration | Technology | Notes |
|------|----------------|------------|-------|
| Weather data | 1 hour | Supabase Edge Functions | Cached at API level |
| Yield predictions | 24 hours (invalidated on new data) | Supabase Realtime | Realtime updates |
| Trust scores | Until recalculation trigger | Supabase Cache | Built-in query cache |
| Static model metadata | 7 days | Supabase Storage | Delivered via CDN |
| Dashboard aggregations | 15 minutes | PostgreSQL Query Cache | Automatic result caching |

**Supabase-Specific Optimizations:**
- **Realtime Subscriptions** for live data updates
- **Edge Functions** for distributed caching
- **PostgreSQL Query Planner** for automatic optimization
- **CDN Delivery** for static assets via Supabase Storage
- **Connection Pooling** handled automatically

---

## 15. Competitive Analysis

### 15.1 Feature Comparison

| Feature | Traditional Agri-Tools | CropIn | DeHaat | AgriMitra 360 |
|---------|------------------------|--------|--------|---------------|
| Disease Detection | ✔ | ✔ | ❌ | ✔ |
| Yield Prediction | ❌ | ✔ | ❌ | ✔ |
| Sustainability Score | ❌ | ❌ | ❌ | ✔ |
| Trust Score / Credit Scoring | ❌ | ❌ | ❌ | ✔ |
| Credit Integration with Banks | ❌ | ❌ | ❌ | ✔ |
| Explainable AI Dashboard | ❌ | ❌ | ❌ | ✔ |
| Financial Inclusion Focus | ❌ | ❌ | Partial | ✔ |

### 15.2 Competitive Moats

1. **The Bridge** — No competitor connects agricultural intelligence to financial credit
2. **Explainability** — Only platform offering full AI transparency for regulatory compliance
3. **Sustainability-to-Credit Link** — First to use environmental scoring in credit decisions
4. **India-Specific Training** — Models tuned for Indian crops, regions, and conditions
5. **Lightweight AI** — MobileNetV2 enables deployment where larger models cannot run

---

## 16. Risk Analysis & Mitigation

| # | Risk | Probability | Impact | Mitigation Strategy |
|---|------|-------------|--------|---------------------|
| R1 | Low farmer digital literacy | High | Medium | Simple UI, local language, onboarding via FPOs |
| R2 | Model accuracy degradation | Medium | High | Continuous retraining pipeline, A/B testing |
| R3 | Data quality issues | High | High | Validation rules, anomaly detection, manual audit |
| R4 | Bank integration resistance | Medium | High | Start with progressive NBFCs, demonstrate ROI |
| R5 | Regulatory changes | Low | High | Modular compliance layer, legal advisory board |
| R6 | Farmer data privacy breach | Low | Critical | Encryption, access controls, security audits |
| R7 | Weather data API downtime | Medium | Medium | Multiple providers, cached fallback data |
| R8 | Model bias (regional, gender) | Medium | High | Fairness monitoring, bias-adjusted scoring |
| R9 | Scalability bottleneck at ML layer | Medium | Medium | Model optimization, queue-based async inference |
| R10 | Competitor replication | Medium | Medium | First-mover advantage, data network effects |

---

## 17. Deployment Strategy (ALL FREE)

### 17.1 Hackathon Deployment (24 Hours — $0)

| Component | Host | Free Tier | Deploy Method |
|-----------|------|-----------|---------------|
| **Frontend** | Vercel | Unlimited deploys, custom domain, SSL | `git push` → auto-deploy |
| **Backend API** | Render | 750 hrs/month free, auto-sleep after 15min inactivity | `git push` → auto-deploy |
| **Database** | Supabase | 500MB storage, 50K reads/month, 2 projects, 3 tables (farmers, crop_reports, credit_scores) | Dashboard setup (5 min) | Auto-generated REST API, built-in auth, PostgreSQL with DECIMAL(5,4) & DECIMAL(12,2) precision |
| **File Storage** | Supabase Storage | 1GB free | Same Supabase project |
| **AI Model** | Bundled with frontend (TF.js) | N/A — runs in browser | Deployed with frontend |

### 17.2 Quick Deploy Steps

```
1. Create Supabase project → get URL + anon key (5 min)
2. Run SQL migrations in Supabase SQL editor (5 min)
3. Push frontend to GitHub → connect to Vercel (3 min)
4. Push backend to GitHub → connect to Render (3 min)
5. Set environment variables on Vercel + Render:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - OPENWEATHER_API_KEY
6. Done. Live demo URLs ready.
```

### 17.3 Post-Hackathon Scale Path

| Phase | When | What | Cost |
|-------|------|------|------|
| Hackathon | Now | Vercel + Render + Supabase free | $0 |
| Pilot | Month 2–4 | Upgrade Supabase Pro, add Redis | ~$25/mo |
| Scale | Month 5+ | AWS/GCP, Kubernetes, custom domain | Variable |

---

## 18. Success Metrics & KPIs

### 18.1 Product KPIs

| KPI | Target (Year 1) | Measurement |
|-----|-----------------|-------------|
| Farmers onboarded | 10,000 | Registered users |
| Disease detections performed | 100,000 | API calls |
| Trust Scores generated | 8,000 | Unique farmer scores |
| Loan applications facilitated | 2,000 | Submitted via platform |
| Loan approval rate (via AgriMitra) | ≥ 60% | Approved / Applied |
| Disease detection accuracy | ≥ 92% | Validation set |
| Trust Score–NPA correlation | < 8% NPA | Compared to industry ~12% |
| Farmer platform retention (90-day) | ≥ 40% | Monthly active users |

### 18.2 Business KPIs

| KPI | Target | Timeline |
|-----|--------|----------|
| Bank partners | 10 | Year 1 |
| Monthly revenue (API fees) | ₹5 Lakhs | Month 12 |
| Cost per farmer acquisition | < ₹50 | Ongoing |
| Platform uptime | ≥ 99.5% | Monthly |

### 18.3 Impact KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| Farmers gaining first formal credit | 1,500 | Via bank partner data |
| Average crop loss reduction | 15% | Before/after comparison |
| Farmer income improvement | 10% | Survey data |
| Financial inclusion index improvement | Measurable increase in pilot districts | NABARD data |

---

## 19. 24-Hour Hackathon Sprint Plan

> **This replaces the quarterly roadmap. Everything below must be completed in 24 hours.**

```
⏱️ 24-HOUR SPRINT TIMELINE

┌───────────────────────────────────────────────────────────┐
│ WAVE 1 (Hours 0–4): FOUNDATION                           │
│ • Supabase project + database schema                     │
│ • Vite + React scaffold                                  │
│ • Express.js backend scaffold                            │
│ • Supabase Auth integration                              │
│ • Environment variables + GitHub repos                   │
├───────────────────────────────────────────────────────────┤
│ WAVE 2 (Hours 4–8): BRIDGE PILLAR 1 — CROP INTELLIGENCE   │
│ • Load pretrained MobileNetV2 model (from Kaggle/TF Hub)  │
│ • Build image upload + inference API                      │
│ • Store diagnosis results in Supabase                    │
│ • Build Crop Diagnosis UI (upload → result → treatment)   │
├───────────────────────────────────────────────────────────┤
│ WAVE 3 (Hours 8–12): BRIDGE PILLARS 2–3                   │
│ • Yield prediction (rule-based formula + OpenWeatherMap)  │
│ • Sustainability scoring (weighted formula from farmer    │
│   profile inputs)                                        │
│ • Build Farmer Dashboard UI (scores + charts)             │
├───────────────────────────────────────────────────────────┤
│ WAVE 4 (Hours 12–16): THE BRIDGE — TRUST SCORE ENGINE     │
│ • Trust Score calculator (weighted composite formula)     │
│ • Credit rating assignment logic                         │
│ • Explainability breakdown (component-level Chart.js)     │
│ • Trust Score detail page UI                             │
│ • Bank dashboard with farmer portfolio view               │
├───────────────────────────────────────────────────────────┤
│ WAVE 5 (Hours 16–20): INTEGRATION + POLISH               │
│ • Connect all modules end-to-end                        │
│ • Loan application flow (simulated/mock)                 │
│ • Landing page with bridge visual                        │
│ • UI polish (colors, animations, responsive)              │
│ • Seed database with demo farmer data                    │
├───────────────────────────────────────────────────────────┤
│ WAVE 6 (Hours 20–24): DEPLOY + DEMO PREP                 │
│ • Deploy frontend to Vercel (FREE)                       │
│ • Deploy backend to Render (FREE)                        │
│ • Smoke test all flows on live URLs                      │
│ • Record demo video / prepare presentation               │
│ • Final bug fixes                                        │
└───────────────────────────────────────────────────────────┘
```

### 19.1 Wave Checklist (Mark as you go)

- [ ] **Wave 1**: Foundation (Supabase + React + Express scaffold)
- [ ] **Wave 2**: Crop Intelligence (MobileNetV2 pretrained inference)
- [ ] **Wave 3**: Yield + Sustainability (rule-based formulas)
- [ ] **Wave 4**: Trust Score Engine + XAI charts (THE BRIDGE)
- [ ] **Wave 5**: Integration + UI polish + demo data
- [ ] **Wave 6**: Deploy to Vercel + Render + demo prep

### 19.2 Post-Hackathon Roadmap

| Phase | Timeline | Upgrades |
|-------|----------|----------|
| v1.1 | Week 2–4 | Replace rule-based yield with XGBoost ML model |
| v1.2 | Month 2 | Add SHAP explainability, multi-language support |
| v2.0 | Month 3–4 | Bank API integration, Aadhaar eKYC, PWA mobile |
| v3.0 | Month 5+ | National scale: Kubernetes, NABARD partnership |

---

## 20. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Bridge** | The core metaphor and architecture of AgriMitra 360 — connecting agricultural data to financial decisions |
| **Trust Score** | AI-generated creditworthiness score (300–900) for farmers without traditional credit history |
| **FPO** | Farmer Producer Organization — cooperative bodies for organized farming |
| **NBFC** | Non-Banking Financial Company |
| **NPA** | Non-Performing Asset — loans that have defaulted |
| **MSP** | Minimum Support Price — government-set floor price for crops |
| **PlantVillage** | Open-source labeled dataset of plant disease images |
| **MobileNetV2** | Lightweight CNN architecture by Google, optimized for mobile deployment |
| **XAI** | Explainable AI — models that provide human-interpretable reasoning |
| **SHAP** | SHapley Additive exPlanations — method for interpreting ML predictions |

### Appendix B: References

1. PlantVillage Dataset — [https://plantvillage.psu.edu](https://plantvillage.psu.edu)
2. MobileNetV2 Paper — Sandler et al., 2018 (arXiv:1801.04381)
3. India Agricultural Census 2021–22
4. RBI Report on Financial Inclusion (2024)
5. NABARD Annual Report (2024–25)
6. Government of India Open Data Platform — [https://data.gov.in](https://data.gov.in)
7. IMD Weather Data Services — [https://mausam.imd.gov.in](https://mausam.imd.gov.in)

### Appendix C: Bridge Concept — Closing Statement

> **"AgriMitra 360 turns agricultural data into financial dignity."**

The **bridge** between farms and finance isn't just a technical architecture — it's a social commitment. Every Trust Score generated is a step toward a future where no farmer is denied credit simply because the system couldn't see their worth.

**AgriMitra 360 sees their worth. And builds the bridge to prove it.**

---

## 21. Context Maintenance Guide

> **FOR AI MODELS**: Follow these rules when you make changes to the project.

### 21.1 When You Build Something

After implementing any module or feature:
1. Update `PROJECT_STATE.completed` — move the item from `not_started` → `completed`
2. Update `PROJECT_STATE.in_progress` — add whatever you're working on next
3. Update `PROJECT_STATE.last_updated` with today's date

### 21.2 When You Change a Design Decision

1. Add a new row to the `DECISION_LOG` table
2. Reference the old decision being overridden
3. Document the rationale clearly

### 21.3 When You Add a New Module

1. Add a new entry to `MODULE_REGISTRY` with all fields
2. Update `DEPENDENCY_FLOW` build order if needed
3. Add the API endpoints to §11.1
4. Add the database tables to §9.1

### 21.4 When You Fix a Bug

1. Note the fix in `PROJECT_STATE.completed`
2. If the bug revealed a design issue, update the relevant §6.x spec

### 21.5 Phase Transition Checklist

When moving between project phases, update these sections:
- [ ] `PROJECT_STATE.current_phase`
- [ ] `PROJECT_STATE.current_milestone`
- [ ] Move items between `completed` / `in_progress` / `not_started`
- [ ] Update `known_risks` if any were resolved or new ones discovered
- [ ] Update `blocking_decisions` if anything is pending

---

### Appendix D: Context Protocol Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-22 | Initial PRD created |
| 2.0 | 2026-03-22 | Added CONTEXT_PROTOCOL, PROJECT_STATE, QUICK_IDENTITY, MODULE_REGISTRY, DEPENDENCY_FLOW, DECISION_LOG, Context Maintenance Guide. Optimized for AI model consumption. |

---

*Document prepared for National-Level Competition Submission*
*Optimized for AI model context consumption — any model, any phase, instant understanding.*
*© 2026 Team AgriMitra — All Rights Reserved*
