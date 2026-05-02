# MediRoute AI

MediRoute AI is a healthcare cost transparency and loan underwriting platform built for the TenzorX hackathon. It maps user symptoms to ICD-10 medical codes with Gemini 2.5 Flash, compares hospital costs by city, and gives an automated loan decision using fair market pricing.

The current app is the Phase 2 flow:

```text
Registration -> Disease Search -> Hospital Map + Cost Comparison -> Loan Underwriting
```

## Features

- Patient registration with Aadhaar, PAN, phone, occupation, and city.
- Gemini 2.5 Flash symptom analysis with ICD-10 output and procedure aliases.
- Hospital map view using Leaflet and OpenStreetMap.
- City-wise cost comparison with min, max, fair market price, and itemized cost breakdown.
- Sort hospitals by cost, quality, or value.
- Hospital selection with smart cheaper-hospital suggestions.
- Loan underwriting based on fair market price tolerance.
- Local JSON persistence in `storage/`.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS 4, Framer Motion, Leaflet, Lucide React, Recharts.
- Backend: FastAPI, Uvicorn, Pydantic Settings, SQLAlchemy.
- AI: Gemini 2.5 Flash via `langchain-google-genai`.
- Storage: Local JSON files in `storage/`.
- Database: SQLite is still present for legacy/full-analysis routes; Phase 2 persistence uses local JSON.

## Project Structure

```text
D:\Tenzorx\Tenzorx
├── mediroute-backend/
│   ├── main.py                 # FastAPI app and API routes
│   ├── config.py               # Runtime settings
│   ├── seed_storage.py         # Generates storage/hospitals_data.json
│   ├── storage_utils.py        # JSON file helpers
│   ├── agents/
│   │   ├── diagnostician.py    # Gemini ICD-10 mapping
│   │   ├── cost_auditor.py
│   │   └── underwriter.py
│   ├── services/
│   ├── hospitals.json          # Real hospital names and map coordinates
│   └── requirements.txt
├── mediroute-frontend/
│   ├── src/App.jsx
│   ├── src/components/
│   │   ├── RegistrationForm.jsx
│   │   ├── DiseaseSearch.jsx
│   │   ├── HospitalMapView.jsx
│   │   └── LoanDecision.jsx
│   └── package.json
├── storage/
│   ├── users.json
│   ├── searches.json
│   ├── hospitals_data.json
│   ├── cost_comparisons.json
│   └── loan_decisions.json
└── README.md
```

## Current Local Ports

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8011`
- Backend health: `http://localhost:8011/health`

The backend default is `8011` because `8001` was already occupied in the local environment. The frontend defaults to `http://localhost:8011` for API calls.

## Backend Setup

From the project root:

```powershell
cd D:\Tenzorx\Tenzorx\mediroute-backend
.\venv\Scripts\activate
pip install -r requirements.txt
python seed_storage.py
python main.py
```

Expected backend health response:

```json
{"status":"healthy","version":"2.0.0"}
```

If you do not want to activate the venv:

```powershell
cd D:\Tenzorx\Tenzorx\mediroute-backend
.\venv\Scripts\python.exe seed_storage.py
.\venv\Scripts\python.exe main.py
```

## Frontend Setup

In a second terminal:

```powershell
cd D:\Tenzorx\Tenzorx\mediroute-frontend
npm install
npm run dev -- --host localhost --port 5173
```

Open:

```text
http://localhost:5173
```

If the browser still shows old errors after a fix, hard refresh with `Ctrl+F5`.

## Environment Variables

Backend settings are read from `mediroute-backend/.env`.

Useful values:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=8011
DEBUG=False
```

Frontend API override, if needed:

```powershell
$env:VITE_API_BASE_URL="http://localhost:8011"
npm run dev -- --host localhost --port 5173
```

## Test Registration Data

Use this data to quickly pass the first screen:

```text
Full Name: Test User
Age: 22
Aadhaar: 123412341234
PAN: ABCDE1234F
Occupation: Student
City: Nagpur
Phone: 9876543210
```

The frontend sanitizes Aadhaar, phone, and PAN before sending. Aadhaar and phone must contain only the required number of digits after formatting is removed.

## Trial Flows

### Kidney Stone Search

```text
City: Nagpur
Search: Mere pet mein pathri hai
Expected map procedure: Lithotripsy or closest available seeded procedure
```

### Heart/Angioplasty Search

```text
City: Delhi
Search: chest pain and breathlessness
Expected output: ICD-10 style diagnosis, hospital comparison, loan decision
```

### Appendectomy Search

```text
City: Mumbai
Search: sharp lower right abdomen pain with fever
Expected output: appendicitis/appendectomy style result
```

## Main Phase 2 API Endpoints

### Health

```http
GET /health
```

### Register User

```http
POST /api/register-user
```

Body:

```json
{
  "name": "Test User",
  "age": 22,
  "aadhaar": "123412341234",
  "pan": "ABCDE1234F",
  "occupation": "Student",
  "city": "Nagpur",
  "phone": "9876543210"
}
```

Response:

```json
{
  "user_id": "USR-xxxxxxxx",
  "status": "registered",
  "city": "Nagpur"
}
```

### Search Disease

```http
POST /api/search-disease
```

Body:

```json
{
  "user_id": "USR-xxxxxxxx",
  "symptom_text": "Mere pet mein pathri hai"
}
```

Response includes:

```json
{
  "condition": "...",
  "icd10_code": "...",
  "recommended_procedure": "...",
  "confidence_score": 0.9,
  "procedure_aliases": ["..."]
}
```

### Hospitals By City

```http
POST /api/hospitals-by-city
```

Body:

```json
{
  "city": "Nagpur",
  "procedure": "Lithotripsy",
  "icd10_code": "N20.0"
}
```

Response includes:

```json
{
  "city": "Nagpur",
  "icd10_code": "N20.0",
  "procedure": "Lithotripsy",
  "fair_market_price": 85000,
  "min_cost": 45000,
  "max_cost": 150000,
  "hospital_count": 7,
  "hospitals": []
}
```

The backend has fallback matching for unsupported Gemini procedure names so the map can still load seeded market data for the selected city.

### Apply For Loan

```http
POST /api/apply-for-loan
```

Body:

```json
{
  "user_id": "USR-xxxxxxxx",
  "hospital_id": 1,
  "hospital_name": "Hospital Name",
  "icd10_code": "N20.0",
  "procedure": "Lithotripsy",
  "requested_amount": 90000,
  "city": "Nagpur"
}
```

Response includes:

```json
{
  "decision": "APPROVED",
  "fair_market_price": 85000,
  "max_approvable": 93500,
  "requested_amount": 90000,
  "selected_hospital_cost": 88000,
  "city_min_cost": 45000,
  "city_max_cost": 150000,
  "overpricing_pct": 5.88,
  "recommendation": "...",
  "cheaper_alternative": null,
  "emi_options": []
}
```

## Verification Commands

Frontend lint:

```powershell
cd D:\Tenzorx\Tenzorx\mediroute-frontend
npm run lint
```

Frontend build:

```powershell
cd D:\Tenzorx\Tenzorx\mediroute-frontend
npm run build
```

Backend syntax check:

```powershell
D:\Tenzorx\Tenzorx\mediroute-backend\venv\Scripts\python.exe -m py_compile D:\Tenzorx\Tenzorx\mediroute-backend\main.py
```

Backend health check:

```powershell
Invoke-RestMethod -Uri "http://localhost:8011/health" -Method Get
```

Registration smoke test:

```powershell
Invoke-RestMethod -Uri "http://localhost:8011/api/register-user" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{
    name="Test User"
    age=22
    aadhaar="123412341234"
    pan="ABCDE1234F"
    occupation="Student"
    city="Nagpur"
    phone="9876543210"
  } | ConvertTo-Json)
```

Hospital map smoke test:

```powershell
Invoke-RestMethod -Uri "http://localhost:8011/api/hospitals-by-city" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{
    city="Nagpur"
    procedure="Cholecystectomy"
    icd10_code="K80"
  } | ConvertTo-Json)
```

## Troubleshooting

### Registration failed with 422

The backend validates registration fields.

Required format:

```text
Aadhaar: exactly 12 digits
PAN: ABCDE1234F format
Phone: exactly 10 digits
Age: valid number
City: one selected city
```

The frontend now strips spaces and hyphens from Aadhaar and phone before sending.

### Browser says localhost refused to connect

Check that the frontend dev server is running:

```powershell
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
```

Start it again if needed:

```powershell
cd D:\Tenzorx\Tenzorx\mediroute-frontend
npm run dev -- --host localhost --port 5173
```

### Map says Could not fetch regional hospital data

Check backend health:

```powershell
Invoke-RestMethod -Uri "http://localhost:8011/health" -Method Get
```

Regenerate hospital cost data:

```powershell
cd D:\Tenzorx\Tenzorx\mediroute-backend
.\venv\Scripts\python.exe seed_storage.py
```

Restart backend after seeding:

```powershell
.\venv\Scripts\python.exe main.py
```

### Gemini model/API errors

Confirm `.env` contains:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

The diagnostician also retries with `gemini-2.5-flash` as a hard fallback if the configured model call fails.

### Port 8001 conflict

This project now uses backend port `8011` by default. If another process is still listening on `8001`, ignore it unless you intentionally need that process.

To see active listeners:

```powershell
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in 5173,8001,8011 }
```

## Notes

- `storage/hospitals_data.json` is generated from `mediroute-backend/hospitals.json`.
- Phase 2 data is persisted locally in JSON files under `storage/`.
- Existing legacy endpoints are still present for compatibility, including `/api/full-analysis`.
- Docker files exist, but the currently verified run path is local FastAPI + Vite.

