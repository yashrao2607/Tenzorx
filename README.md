# MediRoute AI: Medical Transparency & Underwriting Engine

MediRoute AI is a production-grade healthcare transparency platform designed to eliminate "Information Asymmetry" in medical costs. By mapping natural language symptoms to standardized **ICD-10 codes**, MediRoute enables patients to compare regional hospital costs and secure instant, risk-adjusted medical loans.

## 🚀 Key Features (Phase 2)

- **AI-Powered Disease Mapping**: Uses Gemini 2.5 Flash to convert symptoms (Hindi/English) into standardized ICD-10 medical codes.
- **Regional Transparency Engine**: Dual-pane Map + List view showing every hospital in your city (Nagpur, Mumbai, Delhi, etc.) for a specific procedure.
- **Cost Audit & Breakdown**: Transparent line-item breakdowns (Surgery, Room, Meds, etc.) for each hospital.
- **Smart Underwriting**: Automated loan approval/rejection based on **Fair Market Price (FMP)** with a 10% tolerance margin.
- **Local Persistence**: Full data sovereignty using local JSON storage for user KYC, search logs, and loan decisions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion, Leaflet.js
- **Backend**: FastAPI (Python 3.11), Uvicorn
- **AI**: Google Gemini 2.5 Flash (`langchain-google-genai`)
- **Storage**: Local JSON Persistence (`storage/` directory)

---

## 🚦 Getting Started

### 1. Backend Setup
```bash
cd mediroute-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
*Note: The backend runs on port **8001**.*

### 2. Frontend Setup
```bash
cd mediroute-frontend
npm install
npm run dev
```
*Note: The frontend runs on port **5173**.*

### 3. Seed Storage
To generate the hospital cost data and sample records:
```bash
cd mediroute-backend
python seed_storage.py
```

---

## 🧪 Trial Scenarios

### Case 1: Kidney Stone Transparency (Nagpur)
1. **Register**: Enter your details and select **Nagpur**.
2. **Search**: Enter *"Mere pet mein pathri hai"* or *"I have kidney stones"*.
3. **Map**: View all hospitals in Nagpur performing **Lithotripsy** (ICD-10: N20.0).
4. **Audit**: Compare the ₹1.2L hospital vs the ₹45k hospital.
5. **Loan**: Select the ₹45k hospital for instant **APPROVED** status.

### Case 2: Emergency Surgery (Delhi)
- **Symptoms**: "Sharp pain in lower right abdomen, nausea, slight fever."
- **Procedure**: Appendectomy (ICD-10: K35).
- **Underwriting**: Compare your loan request against Delhi's Fair Market Price.

---

## 📂 Project Structure

- `mediroute-backend/`: FastAPI application, AI agents, and storage utilities.
- `mediroute-frontend/`: React application with Leaflet mapping and glassmorphism UI.
- `storage/`: Local JSON files for persistence (Users, Searches, Loans).
- `MASTER_PLAN.md`: Strategic roadmap for future features.

---
*Developed for TenzorX Hackathon by Yash Yadav.*