# Implementation Prompt: MediRoute Evolution Phase 2

## Context
You are tasked with evolving the MediRoute AI platform from a symptom-to-loan prototype into a production-grade transparency and underwriting engine. The core goal is to eliminate "information asymmetry" in healthcare costs using standardized medical codes and automated loan auditing based on regional price benchmarks.

## Technical Requirements
- **Frontend**: React + Tailwind CSS + Framer Motion.
- **Backend**: FastAPI (Python).
- **Storage**: Local File System. Create and use a directory named `storage/` in the project root to store JSON/CSV files for users, hospitals, and medical procedures. Do NOT use external database services or cloud databases.
- **Maps**: Use Leaflet (OpenStreetMap) or a mock Map interface for regional visualization.

## Core Feature Specs

### 1. Unified User Onboarding
- Implement a comprehensive intake form on the landing page.
- **Fields**: Full Name, Age, Aadhaar Card Number, PAN Card Number, Occupation, Current Location (City/District).
- **Storage**: Save this user profile to `storage/users.json`.

### 2. Standardized Search & Mapping (The "Regional Audit" Experience)
- **Search Intent**: When a user searches for a disease in plain language (e.g., "pet mein pathri" / kidney stones), the AI must map this to a **Standardized Government Medical Code** (e.g., ICD-10 code N20.0).
- **Dual-Pane Interface**:
    - **Left Side (Map)**: Render a map of the user's location (e.g., Nagpur). Randomly generate latitude/longitude markers for hospitals in that specific city found in the dataset.
    - **Right Side (Comparison List)**: List all hospitals in that city that perform the procedure corresponding to the medical code.
- **Detailed Interaction**: Clicking a hospital marker or list item must display a **Detailed Cost Structure**:
    - Consultation Fees
    - Room Rent (per day)
    - Injection/Medicine costs
    - Surgeon Fees
    - Estimated Total Cost

### 3. Smart Underwriting & Fraud Detection
- **Logic**:
    - Fetch the `Fair Market Price` (FMP) for the specific medical code in the user's city (calculated as the average or median from `storage/hospitals.json`).
    - **Rejection Logic**: If `User_Loan_Request > (Fair_Market_Price + 10%)`, flag as **"Loan Rejected: Inflated Cost Detected"**. Explain that the request exceeds the regional maximum for this treatment.
    - **Approval Logic**: If `User_Loan_Request <= (Fair_Market_Price + 10%)`, **Approve Loan**.
- **Recommendations**:
    - If the user selects a high-cost hospital, the system must suggest: *"We noticed Hospital X offers the same standardized treatment (Code: N20.0) for ₹20,000 less. Switching will guarantee instant loan approval."*

### 4. Data Integrity & Standardization
- Use the `storage/` folder for all persistence to ensure 100% local operation.
- Use medical codes (ICD-10) as the "Source of Truth" to allow users to compare "Apples to Apples" across different hospitals that might use different names for the same procedure.

## Implementation Guidelines
- **Zero Hallucination**: Every hospital suggestion and cost breakdown must be backed by local JSON data.
- **Efficiency**: Use the existing Gemini 2.5 Flash integration to handle the mapping of "natural language symptoms" to "standardized medical codes".
- **UX/UI**: Maintain a premium, high-tech aesthetic (glassmorphism, dark mode) that builds trust for financial transactions.

---
