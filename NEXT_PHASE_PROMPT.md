# MediRoute Phase 2: Complete Implementation Prompt

> **Goal**: Transform MediRoute from a 3-step prototype into a full-flow platform with User Registration → Disease Search → Hospital Map + Cost Comparison → Loan Underwriting — all backed by local JSON storage and ICD-10 medical code standardization.

---

## SECTION A: EXISTING CODEBASE CONTEXT (DO NOT HALLUCINATE)

### Project Structure
```
D:\Tenzorx\Tenzorx\
├── mediroute-backend/          # FastAPI (Python 3.11)
│   ├── main.py                 # FastAPI app, all API routes
│   ├── config.py               # Settings via pydantic-settings (.env)
│   ├── database.py             # SQLAlchemy engine (SQLite)
│   ├── models.py               # Hospital model (id, name, city, procedure, cost, quality_score)
│   ├── seed.py                 # Seeds ~216 hospitals into SQLite
│   ├── hospitals.json          # 35 real hospitals with lat/lon for Nagpur, Mumbai, Pune, Delhi, Bangalore
│   ├── agents/
│   │   ├── diagnostician.py    # Gemini 2.5 Flash → symptom → {condition, icd10_code, recommended_procedure, confidence_score}
│   │   ├── cost_auditor.py     # Queries SQLite hospitals, applies comorbidity multipliers, returns cost breakdown
│   │   └── underwriter.py      # Compares requested_loan vs risk_adjusted_cost → APPROVE/REVIEW/REJECT
│   ├── services/
│   │   ├── orchestrator.py     # Chains: diagnostician → cost_auditor → underwriter (the main pipeline)
│   │   ├── cost_service.py     # Uses hospitals.json with haversine distance scoring (Nagpur, Mumbai, etc.)
│   │   ├── intent_service.py   # Claude-based (unused in current flow, legacy)
│   │   ├── loan_service.py     # NBFC simulation with EMI options
│   │   ├── pricing_service.py  # SQLite-based pricing with underwriting (alternative to cost_auditor)
│   │   └── ollama_service.py   # Legacy Ollama service (replaced by Gemini)
│   ├── .env                    # GEMINI_API_KEY, GEMINI_MODEL=gemini-2.5-flash, DEBUG=True
│   └── requirements.txt        # fastapi, uvicorn, langchain-google-genai, rapidfuzz, sqlalchemy, etc.
├── mediroute-frontend/         # React 19 + Vite 8 + Tailwind 4 + Framer Motion
│   ├── src/
│   │   ├── App.jsx             # 3-step flow: SymptomForm → CostDashboard → LoanDecision
│   │   ├── index.css           # Tailwind + glassmorphism design system
│   │   └── components/
│   │       ├── SymptomForm.jsx       # Symptom text, city select, comorbidities, loan amount
│   │       ├── CostDashboard.jsx     # Diagnosis header, cost stats, pie chart, hospital list
│   │       ├── LoanDecision.jsx      # APPROVE/REVIEW/REJECT card with underwriting details
│   │       ├── CostBreakdownChart.jsx # Recharts donut chart
│   │       └── HospitalList.jsx      # Top 3 hospitals by value
├── storage/                    # NEW — empty directory for local JSON persistence
├── MASTER_PLAN.md
└── MediRoute_PRD_TenzorX.md
```

### Current API Endpoints (main.py)
| Method | Path | Request Body | What It Does |
|--------|------|-------------|--------------|
| GET | `/health` | — | Health check |
| POST | `/api/full-analysis` | `{symptom_text, city, comorbidities[], requested_loan_amount}` | **Main pipeline**: diagnostician → cost_auditor → underwriter |
| POST | `/api/analyze-symptom` | `{symptom_text}` | Diagnostician only |
| POST | `/api/cost-analysis` | `{procedure, city, comorbidities[], requested_loan_amount}` | Cost auditor + optional underwriting |
| POST | `/api/analyze-intent` | `{symptoms, age, location, ...}` | Legacy Claude intent (unused) |
| POST | `/api/estimate-cost` | `{procedure_name, comorbidities[], location}` | Legacy cost via hospitals.json |
| POST | `/api/apply-loan` | `{patient_name, hospital_name, procedure_name, amount, estimated_cost}` | Legacy NBFC simulation |

### Current Frontend Flow
1. **Step 1 (SymptomForm)**: User enters symptom text, selects city (Delhi/Mumbai/Bangalore), toggles comorbidities, enters loan amount → calls `/api/full-analysis`
2. **Step 2 (CostDashboard)**: Shows diagnosis, confidence, base/adjusted cost, pie chart breakdown, top 3 hospitals
3. **Step 3 (LoanDecision)**: Shows APPROVE/REVIEW/REJECT with overpricing %, reason, fraud flag

### AI Engine
- **Model**: Gemini 2.5 Flash via `langchain-google-genai` (`ChatGoogleGenerativeAI`)
- **API Key**: Set in `.env` as `GEMINI_API_KEY`
- **Prompt**: Returns JSON with `{condition, icd10_code, recommended_procedure, confidence_score}`

### Database
- **SQLite** (`mediroute.db`): ~216 seeded hospitals across Delhi, Mumbai, Bangalore with 3 procedures (Appendectomy, Angioplasty, Knee Replacement)
- **hospitals.json**: 35 real hospitals with real lat/lon for Nagpur, Mumbai, Pune, Delhi, Bangalore (used by `cost_service.py`)

### Design System
- Dark mode (`#020617` background), glassmorphism cards, teal/blue accent gradients
- Tailwind 4 with `@import "tailwindcss"` and `@theme` block in `index.css`
- Framer Motion animations, Lucide React icons, Recharts for charts

---

## SECTION B: WHAT TO BUILD (4 NEW SCREENS + NEW BACKEND)

### Overview of New User Flow
```
[1. Registration Form] → [2. Disease Search] → [3. Hospital Map + Cost Comparison] → [4. Hospital Detail + Select] → [5. Loan Underwriting]
```

### B1. User Registration Form (NEW Step 0 — Landing Page)

**Purpose**: Collect patient KYC data before any medical search.

**Frontend — New Component: `RegistrationForm.jsx`**
- Fields (all required):
  - Full Name (text)
  - Age (number)
  - Aadhaar Card Number (12-digit, masked input)
  - PAN Card Number (ABCDE1234F format, validated)
  - Occupation (dropdown: Salaried, Self-Employed, Student, Retired, Other)
  - Location / City (text input or dropdown — this is used later for map centering)
  - Phone Number (10-digit)
- On submit: POST to `/api/register-user`
- After success: Redirect to Disease Search (Step 2)

**Backend — New Endpoint:**
```
POST /api/register-user
Body: { name, age, aadhaar, pan, occupation, city, phone }
Response: { user_id: "USR-xxxx", status: "registered" }
```
- Generate a unique `user_id` (e.g., `USR-` + 8 hex chars)
- Save to `storage/users.json` (append to array, create file if missing)
- Store user's `city` — this will be auto-used in subsequent searches

**Storage File: `storage/users.json`**
```json
[
  {
    "user_id": "USR-a3f8c912",
    "name": "Yash Yadav",
    "age": 22,
    "aadhaar": "XXXX-XXXX-1234",
    "pan": "ABCDE1234F",
    "occupation": "Student",
    "city": "Nagpur",
    "phone": "9876543210",
    "registered_at": "2026-05-02T15:00:00"
  }
]
```

---

### B2. Disease Search with ICD-10 Mapping (NEW Step 1)

**Purpose**: User types a disease/symptom in natural language (Hindi or English), AI maps it to a standardized ICD-10 medical code.

**Why ICD-10 matters**: Different hospitals call the same procedure different names. ICD-10 is the government standard code — if Code = N20.0 (Kidney Stones / Nephrolithiasis), then every hospital's treatment for N20.0 is comparable. This eliminates confusion.

**Frontend — New Component: `DiseaseSearch.jsx`**
- Single large search input: "Describe your problem (e.g., pet mein pathri, chest pain, knee pain)"
- On submit: POST to `/api/search-disease`
- Show results: ICD-10 code, condition name, recommended procedure, confidence score
- Auto-proceed to Hospital Map screen with the procedure + user's registered city

**Backend — New Endpoint:**
```
POST /api/search-disease
Body: { user_id, symptom_text }
Response: {
  icd10_code: "N20.0",
  condition: "Nephrolithiasis (Kidney Stones)",
  recommended_procedure: "Lithotripsy",
  confidence_score: 0.92,
  procedure_aliases: ["Pathri ka operation", "Stone removal", "ESWL"]
}
```
- Uses existing `DiagnosticianAgent` (Gemini 2.5 Flash)
- **Enhanced prompt**: Must also return `procedure_aliases` (common Hindi/regional names)
- Save the search to `storage/searches.json` for audit trail

---

### B3. Hospital Map + Cost Comparison (NEW Step 2 — Dual Pane)

**Purpose**: Show all hospitals in user's city on a map (left) + cost comparison list (right). This is the core "transparency engine."

**Frontend — New Component: `HospitalMapView.jsx`**
- **Layout**: Split screen — 50% map (left), 50% hospital list (right)
- **Left Pane (Map)**:
  - Use **Leaflet.js** with OpenStreetMap tiles (free, no API key needed)
  - Install: `npm install react-leaflet leaflet`
  - Center map on user's registered city coordinates
  - Place markers for each hospital from the data
  - Marker popup: Hospital name + estimated cost
  - Clicking a marker highlights the corresponding hospital in the right pane list
- **Right Pane (Hospital Comparison List)**:
  - Show ALL hospitals in the city for this procedure (not just top 3)
  - Each hospital card shows: Name, Estimated Total Cost, Quality Score
  - Sort by: Cost (low→high), Quality (high→low), or Value (quality/cost ratio)
  - Clicking a hospital card → expands inline or opens a detail modal

**City Coordinates** (already exist in `cost_service.py`):
```python
CITY_COORDS = {
    "Nagpur": (21.1458, 79.0882),
    "Mumbai": (19.0760, 72.8777),
    "Pune": (18.5204, 73.8567),
    "Delhi": (28.6139, 77.2090),
    "Bangalore": (12.9716, 77.5946)
}
```

**Backend — New Endpoint:**
```
POST /api/hospitals-by-city
Body: { city, procedure, icd10_code }
Response: {
  city: "Nagpur",
  icd10_code: "N20.0",
  procedure: "Lithotripsy",
  fair_market_price: 85000,
  min_cost: 45000,
  max_cost: 150000,
  hospitals: [
    {
      id: 1,
      name: "Wockhardt Super Speciality Hospital",
      lat: 21.1815,
      lon: 79.1247,
      tier: "Premium",
      estimated_total_cost: 125000,
      quality_score: 9.2,
      cost_breakdown: {
        consultation_fee: 2000,
        room_rent_per_day: 4000,
        surgery_fee: 65000,
        medicines_injections: 18000,
        diagnostics: 12000,
        miscellaneous: 24000
      }
    },
    ...
  ]
}
```

**Data Source**: Merge `hospitals.json` (real lat/lon data) with generated cost data. For each hospital, generate a `cost_breakdown` object with these specific categories:
- Consultation Fee
- Room Rent (per day)
- Surgery / OT Fee
- Medicines & Injections
- Diagnostics & Imaging
- Miscellaneous

**Storage**: Save computed results to `storage/cost_comparisons.json` for audit trail.

---

### B4. Hospital Detail + Selection (Expand/Modal within B3)

**Purpose**: When user clicks a hospital, show full cost structure. User selects one hospital to proceed.

**Frontend**: Expand the hospital card or show a modal with:
- Full cost breakdown table (6 line items)
- ICD-10 code badge showing standardization
- "Select This Hospital" button
- Smart suggestion: If this hospital is expensive, show: *"Hospital X offers the same ICD-10 treatment for ₹20,000 less"*

**On "Select This Hospital"**: Store the selection and proceed to Loan screen.

---

### B5. Smart Loan Underwriting (ENHANCED Step 3)

**Purpose**: Auto-approve or reject loan based on Fair Market Price (FMP) for the ICD-10 code in that city.

**Logic (implement in `UnderwriterAgent` or new service):**
```python
fair_market_price = median(all_hospital_costs_for_this_procedure_in_this_city)
max_approvable = fair_market_price * 1.10  # 10% tolerance

if requested_loan <= max_approvable:
    decision = "APPROVED"
elif requested_loan <= fair_market_price * 1.30:
    decision = "REVIEW — Exceeds FMP by {x}%"
else:
    decision = "REJECTED — Inflated cost detected"
```

**Frontend — Enhanced `LoanDecision.jsx`:**
- Show: Requested Amount vs Fair Market Price vs Selected Hospital Cost
- Show min/max range for this ICD-10 code in the city
- If REJECTED: Show recommendation — *"Switch to [cheaper hospital] for guaranteed approval"*
- If APPROVED: Show EMI options (12 months 0%, 24 months 8%)

**Backend — Enhanced Endpoint:**
```
POST /api/apply-for-loan
Body: { user_id, hospital_id, icd10_code, procedure, requested_amount }
Response: {
  decision: "APPROVED" | "REVIEW" | "REJECTED",
  fair_market_price: 85000,
  max_approvable: 93500,
  requested_amount: 90000,
  selected_hospital_cost: 88000,
  city_min_cost: 45000,
  city_max_cost: 150000,
  overpricing_pct: 5.88,
  recommendation: "Your loan is within fair market range. Approved.",
  cheaper_alternative: null | { hospital_name, cost, savings },
  emi_options: [...]
}
```

**Storage**: Save all loan decisions to `storage/loan_decisions.json`.

---

## SECTION C: STORAGE DIRECTORY SPECIFICATION

All persistence MUST use local JSON files in the `storage/` directory. NO external databases, NO cloud services for data storage.

```
storage/
├── users.json              # All registered users
├── searches.json           # All disease search logs (user_id, symptom, icd10, timestamp)
├── hospitals_data.json     # Generated hospital cost data with breakdowns (can be seeded once)
├── cost_comparisons.json   # Computed comparison results per search
└── loan_decisions.json     # All loan application decisions
```

**File I/O Pattern (Python)**:
```python
import json, os

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage")

def read_json(filename):
    filepath = os.path.join(STORAGE_DIR, filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def append_json(filename, record):
    data = read_json(filename)
    data.append(record)
    filepath = os.path.join(STORAGE_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
```

---

## SECTION D: IMPLEMENTATION CONSTRAINTS

1. **Zero Hallucination**: Every hospital name, cost, and location MUST come from `hospitals.json` or `storage/hospitals_data.json`. Never invent data at response time.
2. **ICD-10 is Source of Truth**: The Gemini AI maps symptoms → ICD-10 code. All cost comparisons happen via that code, not by procedure name strings.
3. **Local Storage Only**: Use `storage/` directory with JSON files. No PostgreSQL, no Redis, no external APIs for data storage.
4. **Existing Design System**: Keep the dark-mode glassmorphism aesthetic. Use `glass-card`, `btn-primary`, `input-field` CSS classes from `index.css`.
5. **Keep Existing Code Working**: Do NOT delete or break the existing `/api/full-analysis` pipeline. Add new endpoints alongside.
6. **Leaflet for Maps**: Use `react-leaflet` + `leaflet` npm packages with OpenStreetMap tiles (free, no API key).
7. **Frontend Routing**: Use React state-based step navigation (same pattern as current `App.jsx`) — no need for react-router.

---

## SECTION E: SEED DATA REQUIREMENT

Create a seed script (`seed_storage.py`) that generates `storage/hospitals_data.json` with cost breakdowns for ALL hospitals from `hospitals.json` across multiple procedures:

**Procedures to seed** (with ICD-10 codes and cost ranges in ₹):
| Procedure | ICD-10 | Cost Range |
|-----------|--------|------------|
| Lithotripsy (Kidney Stones) | N20.0 | 40,000 – 1,50,000 |
| Appendectomy | K35 | 50,000 – 1,50,000 |
| Angioplasty | I25.10 | 1,50,000 – 3,50,000 |
| Knee Replacement | M17.1 | 2,50,000 – 5,00,000 |
| Cataract Surgery | H25.0 | 25,000 – 80,000 |
| Hernia Repair | K40 | 40,000 – 1,20,000 |

Each hospital gets a randomized but realistic cost within range, with breakdown percentages:
- Surgery/OT: 40-50%
- Room & Board: 15-20%
- Medicines: 10-15%
- Diagnostics: 5-10%
- Consultation: 3-5%
- Miscellaneous: remainder

---

## SECTION F: UPDATED APP FLOW (App.jsx)

```jsx
// New step flow:
const steps = [
  { id: 0, label: 'Registration', icon: UserPlus },
  { id: 1, label: 'Disease Search', icon: Search },
  { id: 2, label: 'Hospital Map', icon: MapPin },
  { id: 3, label: 'Loan Decision', icon: FileCheck },
];

// State:
const [step, setStep] = useState(0);
const [user, setUser] = useState(null);        // registered user
const [diagnosis, setDiagnosis] = useState(null); // ICD-10 result
const [hospitals, setHospitals] = useState(null);  // hospital list
const [selectedHospital, setSelectedHospital] = useState(null);
const [loanResult, setLoanResult] = useState(null);
```

---
