# Clario Backend API

Node.js + Express + PostgreSQL backend for Clario skincare catalog and AI-style recommendations.

## Quick start

1. Start Postgres with Docker and run schema:
```bash
cd /home/harsh/Desktop/clario/server
docker compose up -d db
# wait for healthy, then
docker compose up migrate
```

2. Configure env (create `.env` next to this README):
```bash
# if .env.example is unavailable, create manually
```

```
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/clario
REQUIRE_API_KEY=false
API_KEY=dev-key
CORS_ORIGIN=*
CSV_PATH=/home/harsh/Desktop/clario/data/skincare.csv
GOOGLE_API_KEY=your-google-genai-key
GEMINI_MODEL=gemini-1.5-flash-latest
GEMINI_MODEL_SUMMARY=gemini-1.5-flash-latest
GEMINI_MODEL_QA=gemini-1.5-flash-latest
GEMINI_CACHE_PATH=/home/harsh/Desktop/clario/data/gemini-enrichment.json
```

3. Install deps and run API:
```bash
pnpm i --prefix /home/harsh/Desktop/clario/server
pnpm --prefix /home/harsh/Desktop/clario/server dev
```

4. Import products from CSV:
```bash
pnpm --prefix /home/harsh/Desktop/clario/server import:products
```

5. (Optional) Enrich products with Gemini:
```bash
export GOOGLE_API_KEY="your-google-genai-key"
pnpm --prefix /home/harsh/Desktop/clario/server enrich:products
```

## Endpoints
- GET `/api/products` – filters: `search, brand, category, skinType, concerns, ingredients, priceMin, priceMax, sort, page, pageSize, match`
- GET `/api/products/:id`
- POST `/api/users`
- GET `/api/users/:id`
- PUT `/api/users/:id`
- POST `/api/recommendations` – body: `{ skinType, concerns[], hasAllergies, allergies, productPreference }`

## Notes
- Basic rate limiting and optional API key via header `x-api-key`.
- Simple rule-based recommendations; ready to swap in ML later.
- Gemini-powered enrichment cache (`data/gemini-enrichment.json`) and live AI endpoints at `/api/ai/summaries` and `/api/ai/ask`.
- Output is JSON only.


