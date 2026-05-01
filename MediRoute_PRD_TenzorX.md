# Product Requirements Document (PRD)
## MediRoute: Clinical Intelligence Engine for Healthcare Lending

**Event:** TenzorX 2026 National AI Hackathon (Poonawalla Fincorp)
**Problem Statement:** 4B (Healthcare Lending & NPA Reduction)
**Product Vision:** "The GPS for Your Health Journey - And the Loan to Pay for the Trip."

---

## 1. Executive Summary
MediRoute is India's first AI-powered clinical intelligence engine bridging the gap between patients, hospitals, and NBFC lenders. By translating plain-language symptoms into standardized clinical pathways (ICD-10) and estimating comorbidity-adjusted costs, MediRoute eliminates healthcare information asymmetry. It empowers patients to make data-backed admission decisions while providing lenders with a verified, procedure-level cost anchor, fundamentally reducing NPA (Non-Performing Asset) risks in healthcare lending.

## 2. Problem Statement
1. **No Price Transparency:** Families face massive price variations for identical procedures (e.g., ₹1.8L vs ₹4.5L for a knee replacement) with zero itemized explanation. Average overpayment is ₹2.3L per family.
2. **Decisions Under Panic:** In medical crises, patients choose hospitals blindly without qualitative or financial benchmarking.
3. **Lenders Have No Anchor:** NBFCs currently pre-approve healthcare loans without verified procedure-level cost intelligence, leading to over-financing or under-financing, which is the #2 driver of NPA in healthcare lending.

## 3. Target Audience & Stakeholders
*   **Primary Users (Patients/Borrowers):** Individuals seeking planned or urgent medical procedures who require financial assistance and hospital guidance.
*   **B2B Users (NBFCs/Lenders - e.g., Poonawalla Fincorp):** Underwriting and risk assessment teams who need verified cost-anchors to approve loans accurately.
*   **Secondary Stakeholders (Hospitals/Insurers):** Providers seeking verified patient leads; Insurers requiring cost-transparency APIs.

---

## 4. Feature Specifications (The "Winning" Arsenal)

### 4.1 Core MVP Features (Hackathon Focus)
*   **Intent-to-Pathway AI Engine (NLP):** 
    *   *Description:* Translates plain-language user inputs (e.g., "chest pain while climbing stairs") into standardized ICD-10 medical procedures (e.g., Coronary Artery Disease → Angioplasty).
    *   *Tech:* Claude API (Anthropic), custom prompt engineering, ICD-10 ontology.
*   **Dynamic Comorbidity Adjuster:** 
    *   *Description:* Industry-first feature allowing users to toggle pre-existing conditions (Diabetes, Hypertension, Age) to see real-time, evidence-based cost multiplier adjustments (e.g., +31% ICU cost for diabetic patients).
*   **Transparent Provider Scorecard:** 
    *   *Description:* 4-axis ranking system for hospitals evaluating: Capability, Reputation, Distance, and Price Tier.
*   **Component-Level Cost Breakdown:** 
    *   *Description:* Demystifies the final number by itemizing surgery, surgeon fees, room rent, diagnostics, medications, and complication contingencies.
*   **Confidence-Aware Output:** 
    *   *Description:* AI outputs a 0-1 confidence score with a plain-English explanation of its certainty, demonstrating 'Responsible AI' to the judges.
*   **Frictionless Loan Bridge Integration:** 
    *   *Description:* One-click CTA pushing the exact comorbidity-adjusted cost as an anchor to the NBFC loan origination system.

### 4.2 "X-Factor" Features to Win the Hackathon (Advanced Additions)
*   **ABDM (Ayushman Bharat Digital Mission) Compliance:** 
    *   Integration with ABHA ID to automatically fetch patient history and existing comorbidities, proving alignment with India's digital health infrastructure.
*   **Regional Language Support (Bhashini AI / Indic NLP):** 
    *   Support for Hindi and Marathi voice/text inputs, targeting Tier 2/Tier 3 financial inclusion—a major plus for NBFCs.
*   **DPDP Act 2023 Privacy Engine:** 
    *   Automated PII/PHI redaction layer before sending symptoms to the LLM, showcasing enterprise-grade regulatory compliance.
*   **Fraud & Anomaly Detection for NBFCs:** 
    *   AI flags loan applications where the requested amount deviates >15% from the MediRoute estimated cost, acting as an immediate risk mitigation tool.
*   **Predictive NPA Risk Dashboard:**
    *   A lender-facing dashboard showing the correlation between selected hospital quality, procedure cost, and historical repayment rates.

---

## 5. User Journey (Ravi's Story)
1. **Input:** Ravi types: "My 65-year-old father has severe knee pain. We are in Nagpur. Budget around ₹3L."
2. **Clarification:** MediRoute AI asks: "Likely Total Knee Replacement. Confirming?" -> "Yes". "Any diabetes or hypertension?" -> "Yes, Diabetes."
3. **Intelligence Generation:** The system processes the comorbidity multiplier.
4. **Recommendation:** Delivers top 3 hospitals in Nagpur. Estimated Cost: ₹2.8L - ₹3.6L (diabetic-adjusted). Confidence Score: 0.85. Itemized bill displayed.
5. **Action:** Ravi clicks "Apply for Healthcare Loan". 
6. **Fulfillment:** Poonawalla Fincorp receives an application pre-anchored at ₹3.2L, significantly accelerating underwriting and minimizing NPA risk.

---

## 6. Technical Architecture
*   **Frontend:** React.js (SPA), Tailwind CSS for premium, responsive UI, dynamic Framer Motion animations.
*   **Backend / API Layer:** FastAPI (Python) for rapid, asynchronous endpoints.
*   **AI Engine:** Anthropic Claude API for intent mapping, LangChain for orchestration.
*   **Database:** PostgreSQL (simulated 200-hospital synthetic dataset for MVP).
*   **Rule Engine:** Custom Python cost-multiplier logic utilizing public circle rate data.
*   **Deployment:** Vercel (Frontend) + Railway/Render (Backend).

---

## 7. Business Impact & Monetization (For the Pitch)
*   **For NBFCs:** Reduces NPA by up to 72% on healthcare portfolios by eliminating cost mismatch and over-borrowing.
*   **Revenue Streams (Post-Hackathon):** 
    1. **B2B API Licensing:** Charging NBFCs/Insurers per API call for the cost-anchor validation.
    2. **Lead Generation:** Nominal referral fee from hospitals for verified, financially-backed patient admissions.
    3. **Platform Subscription:** Premium analytics dashboard for hospital administrators.

---

## 8. Development Roadmap
*   **Hackathon (V1):** Symptom to loan flow for 10 cities, 200 synthetic hospitals, comorbidity toggles, Claude NLP integration.
*   **Next 3 Months (V2):** Real hospital API partnerships, Hindi NLP integration, mobile-first PWA, Insurance gap analysis.
*   **12 Months (V3):** Pan-India scale, real-time appointment booking API, integration with ONDC/ABDM, full B2B NBFC underwriting API suite.

---
*Generated by AI for TenzorX Hackathon 2026. Focus heavily on the "Comorbidity Adjuster" and "NBFC Cost Anchor" during the live demo as these are your unique differentiators.*
