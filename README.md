
# AgriMitra 360 — AI for Agricultural Trust & Credit

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![Status](https://img.shields.io/badge/Status-Prototype-blue)](https://github.com/your-username/agrimitra-360)

An open-source MVP that converts farm data into transparent, bankable trust scores to help smallholder farmers access credit.

Key highlights:
- Real-time crop disease detection (MobileNetV2)
- Rule-based yield prediction using weather and soil inputs
- Sustainability scoring and explainable Trust Score (300–900)

---

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Demo

Screenshots and demo clips go here. Replace with live demo links or embed videos for investor demos.

---

## Features

- Crop disease detection (MobileNetV2) — health score per image
- Yield prediction combining crop factors, health, and weather
- Sustainability and environmental impact scoring
- Trust Score generator (explainable breakdown for banks)
- Dashboard with charts and explainability reports

---

## Architecture

Conceptually:

```
[Farm Data] -> [AI/ML Engines] -> [Trust Score Engine] -> [Dashboard & API]
```

Modules:
- `ai/` — crop intelligence, yield, trust engines
- `server/` — API, score logic, database models
- `client/` — React dashboard and farmer portal
- `database/` — SQL schema and seed data

---

## Quick Start

Prerequisites:
- Node.js 18+
- npm (or yarn)
- Git
- Supabase project (free tier)
- OpenWeatherMap API key

Clone and install:

```bash
git clone https://github.com/your-username/agrimitra-360.git
cd agri-360
npm install
cd client && npm install && cd ../server && npm install
```

Configuration:

```bash
cp .env.example .env
# Edit .env with your SUPABASE and OPENWEATHER keys
```

Database:
- Create a Supabase project and run `database/schema.sql` to create tables.
- (Optional) Run `database/seed.sql` for demo data.

Run locally (development):

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev
```

Open the frontend at http://localhost:5173 and the API at http://localhost:3000

---

## Configuration

Required environment variables (example in `.env.example`):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (for server-side operations)
- `OPENWEATHER_API_KEY`
- `PORT` (default: 3000)

---

## Development Notes

- Use the pretrained MobileNetV2 model (no training in the MVP)
- Yield formula is rule-based and lives under `ai/yield-prediction`
- Trust score composition: Health (30%) · Yield (25%) · Sustainability (20%) · History (15%) · Compliance (10%)

Testing:

```bash
# Add project-specific tests to `server/` and `client/` and run them here
```

---

## Contributing

Contributions are welcome. Please:

1. Fork the repo
2. Create a feature branch
3. Commit and push your changes
4. Open a Pull Request with a clear description and testing notes

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details (if present).

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.

---

## Contact

Team AgriMitra — https://github.com/your-username/agrimitra-360

Built with ❤️ for farmers and financial inclusion.

