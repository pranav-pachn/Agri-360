# 🌾💰 AgriMitra 360

**AI-Powered Agricultural Intelligence & Financial Trust System**

*From Crop Health to Credit Wealth.*

<<<<<<< HEAD

=======
[![Hackathon](https://img.shields.io/badge/Hackathon-24%20Hours-red)](https://github.com/agrimitra-360)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Hackathon%20MVP-blue)](https://github.com/agrimitra-360)
>>>>>>> 8313c4e (fird)

> **An AI-powered bridge between agriculture intelligence and financial credit for Indian farmers**

---

## 🎯 Overview

**Problem**: 47% of Indian farmers lack formal credit access, while banks have zero visibility into farm productivity data.

**Solution**: AgriMitra 360 translates farm data into bankable trust scores using:
- 🤖 **AI Disease Detection** - MobileNetV2 powered crop health analysis
- 📊 **Yield Prediction** - Rule-based forecasting using weather and soil data
- 🌱 **Sustainability Scoring** - Environmental impact assessment
- 🏦 **Trust Score (300-900)** - Composite credit rating for financial decisions

**Target Users**: Smallholder farmers, bank loan officers, agriculture officers

---

## 🛠️ Tech Stack (100% FREE)

| Component | Technology | Why Chosen |
|-----------|------------|------------|
| **Frontend** | React.js + Vite | Fastest setup, hot reload, zero config |
| **Backend** | Node.js + Express | Lightweight, scalable, free hosting |
| **Database** | Supabase (PostgreSQL) | Free tier with auto-generated REST API |
| **AI/ML** | MobileNetV2 (Pretrained) | 14MB model, no training needed |
| **Storage** | Supabase Storage | 1GB free tier for images |
| **Weather API** | OpenWeatherMap | 60 calls/min, instant API key |
| **Visualization** | Chart.js | Simple, visual, free charts |
| **Deployment** | Vercel + Render | Generous free tiers, instant deploy |

---

## 🏗️ Architecture: The Bridge Concept

```
[Farm Data] → [AI Analysis] → [Trust Score] → [Credit Decision]
     ↓              ↓              ↓              ↓
Crop Images → Disease Detection → Health Score → Bank Loan
Weather Data → Yield Prediction → Risk Assessment → Insurance
Soil Quality → Sustainability → Environmental Impact → Policy Planning
```

### Module Dependencies
1. **DATABASE** → Schema & models
2. **AUTH** → User authentication (Supabase Auth)
3. **CROP_INTEL** → MobileNetV2 disease detection
4. **YIELD_PRED** → Rule-based yield forecasting
5. **SUSTAINABILITY** → Environmental scoring
6. **AGRI_CREDIT** → Trust Score calculation (THE BRIDGE ❤️)
7. **XAI_DASHBOARD** → Explainability & visualization

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Free Supabase account
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/agrimitra-360.git
cd agrimitra-360
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials:
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# OPENWEATHER_API_KEY=your_openweather_key
```

4. **Database Setup**
- Create a new project on [Supabase](https://supabase.com)
- Run the SQL migration from `database/schema.sql`
- Set up storage buckets for crop images

5. **Run the Application**
```bash
# Start backend server (port 3000)
cd server
npm run dev

# Start frontend (port 5173)
cd ../client
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Supabase Dashboard: Your project URL

---

## 📁 Project Structure

```
agrimitra-360/
├── client/                 # React.js frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   └── utils/         # Helper functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middlewares/   # Auth, validation
│   │   ├── config/        # Database, API configs
│   │   └── models/        # Data models
│   └── package.json
├── database/               # Database schemas
│   ├── schema.sql         # Database structure
│   └── seed.sql           # Sample data
├── ai/                     # AI/ML modules
│   ├── crop-intelligence/ # Disease detection
│   ├── yield-prediction/  # Yield forecasting
│   └── trust-engine/      # Credit scoring
├── docs/                   # Documentation
│   ├── PRD.md            # Product Requirements
│   ├── ARCHITECTURE.md   # System design
│   └── API.md            # API documentation
└── scripts/               # Utility scripts
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Crop Intelligence
- `POST /api/v1/crop/diagnose` - Analyze crop image for diseases
- `GET /api/v1/crop/history/:farmerId` - Get farmer's crop history

### Yield Prediction
- `GET /api/v1/yield/predict/:farmerId` - Predict crop yield

### Trust Score & Credit
- `GET /api/v1/trust-score/:farmerId` - Get farmer's trust score
- `POST /api/v1/credit/apply` - Apply for credit
- `GET /api/v1/trust-score/:farmerId/explain` - Explainability report

---

## ✨ Features Deep Dive

### 🤖 Crop Intelligence Engine
- **Technology**: MobileNetV2 (pretrained)
- **Input**: 224×224×3 RGB crop images
- **Output**: Disease classification + health score (0-100)
- **Diseases**: 38 classes from PlantVillage dataset
- **Processing**: Real-time inference via TensorFlow.js

### 📊 Yield Prediction Module
- **Technology**: Rule-based formula (hackathon MVP)
- **Factors**: Crop type base yield × health factor × weather factor × soil factor
- **Output**: Predicted yield in tons/hectare
- **Data Sources**: OpenWeatherMap API, user inputs

### 🌱 Sustainability Scoring
- **Parameters**: Water usage, pesticide impact, crop diversity, soil health
- **Formula**: Weighted composite score (0-100)
- **Purpose**: Environmental impact assessment

### 🏦 Trust Score Engine (The Bridge ❤️)
- **Range**: 300-900 (mirrors CIBIL score range)
- **Components**: Health score (30%) + Yield prediction (25%) + Sustainability (20%) + Historical data (15%) + Compliance (10%)
- **Output**: Trust score + credit rating + explainability breakdown

### 📈 Explainable AI Dashboard
- **Technology**: Chart.js visualizations
- **Features**: Score breakdown, trend analysis, risk factors
- **Purpose**: Transparency for farmers and banks

---

## 🏃‍♂️ Development Guidelines

### Hackathon Constraints
- **Time Limit**: 24 hours
- **Budget**: $0 - All tools, APIs, and hosting are FREE
- **Scope**: MVP with core features only
- **Deployment**: Demo-ready with sample data

### Free API Limits
- **Supabase**: 500MB storage, 50K row reads/month
- **OpenWeatherMap**: 60 calls/minute
- **Vercel**: 100GB bandwidth/month
- **Render**: 750 hours/month

### Development Best Practices
- Use the pretrained MobileNetV2 model (no custom training)
- Implement rule-based logic for yield prediction
- Follow the exact formulas from the PRD
- Keep all API responses matching the JSON schemas
- Test with sample data before demo

---

## 🚀 Deployment

### Environment Variables
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# External APIs
OPENWEATHER_API_KEY=your_openweather_api_key

# Application
NODE_ENV=production
PORT=3000
```

### Build Process
```bash
# Build frontend
cd client
npm run build

# Deploy to Vercel (frontend)
vercel --prod

# Deploy to Render (backend)
# Connect your GitHub repository to Render
# Set environment variables in Render dashboard
```

### Production URLs
- Frontend: Your Vercel app URL
- Backend API: Your Render app URL
- Database: Your Supabase project URL

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Test all changes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **PlantVillage Dataset** - For crop disease images
- **TensorFlow Hub** - For pretrained MobileNetV2 model
- **Supabase** - For generous free tier
- **OpenWeatherMap** - For free weather API
- **Vercel & Render** - For free hosting

---

## 📞 Contact

- **Project Team**: Team AgriMitra
- **Hackathon**: National Agricultural Innovation Challenge 2026
- **Repository**: https://github.com/your-username/agrimitra-360

---

*Built with ❤️ for Indian farmers in 24 hours with $0 budget*
