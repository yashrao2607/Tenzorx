import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, MapPin, CheckCircle, ArrowRight, ShieldCheck, CreditCard, ActivitySquare, ChevronRight } from 'lucide-react';
import './index.css';

const API_BASE = 'http://localhost:8000/api';

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('Nagpur');
  const [age, setAge] = useState(55);
  const [comorbidities, setComorbidities] = useState([]);
  
  // API Results
  const [intentResult, setIntentResult] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loanResult, setLoanResult] = useState(null);

  const COMORBIDITIES_LIST = ["Diabetes", "Hypertension", "Cardiac Disease", "Age > 60"];
  const CITIES = ["Nagpur", "Mumbai", "Pune", "Delhi"];

  const handleToggleComorbidity = (item) => {
    if (comorbidities.includes(item)) {
      setComorbidities(comorbidities.filter(c => c !== item));
    } else {
      setComorbidities([...comorbidities, item]);
    }
  };

  const handleAnalyzeAndEstimate = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      // 1. Analyze Intent
      const intentRes = await fetch(`${API_BASE}/analyze-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, age, location })
      });
      const intentData = await intentRes.json();
      setIntentResult(intentData);

      // 2. Get Estimates
      const finalComorbidities = [...comorbidities];
      if (age > 60 && !finalComorbidities.includes("Age > 60")) {
        finalComorbidities.push("Age > 60");
      }

      const estRes = await fetch(`${API_BASE}/estimate-cost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedure_name: intentData.procedure_name,
          comorbidities: finalComorbidities,
          location
        })
      });
      const estData = await estRes.json();
      setEstimates(estData);
      setStep(2);
    } catch (error) {
      console.error("Error calling API:", error);
      alert("Backend API is not running or unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLoan = async () => {
    if (!selectedHospital) return;
    setLoading(true);
    try {
      const loanRes = await fetch(`${API_BASE}/apply-loan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: "John Doe",
          hospital_name: selectedHospital.hospital_name,
          procedure_name: intentResult.procedure_name,
          amount: selectedHospital.estimated_cost
        })
      });
      const loanData = await loanRes.json();
      setLoanResult(loanData);
      setStep(3);
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <ActivitySquare color="#00e5ff" size={32} />
          <span>MediRoute<span className="gradient-text">.AI</span></span>
        </div>
        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} />
          <div className={`step-dot ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} />
          <div className={`step-dot ${step === 3 ? 'active' : ''}`} />
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="main-content split"
            >
              <div className="glass-panel card">
                <h1 className="title">Find The Best Care</h1>
                <p className="subtitle">Tell us what's wrong, we'll map the procedure, cost, and financing.</p>

                <div className="form-group">
                  <label className="form-label">Describe your symptoms or condition</label>
                  <textarea 
                    className="input-field" 
                    rows={4} 
                    placeholder="e.g., Severe knee pain, difficulty climbing stairs..."
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label className="form-label">City</label>
                    <select className="input-field" value={location} onChange={e => setLocation(e.target.value)}>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Patient Age</label>
                    <input type="number" className="input-field" value={age} onChange={e => setAge(parseInt(e.target.value))} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pre-existing Conditions (Comorbidities)</label>
                  <div className="checkbox-grid">
                    {COMORBIDITIES_LIST.map(c => (
                      <div 
                        key={c} 
                        className={`checkbox-label ${comorbidities.includes(c) ? 'selected' : ''}`}
                        onClick={() => handleToggleComorbidity(c)}
                      >
                        <div style={{ 
                          width: '16px', height: '16px', border: '1px solid var(--primary-color)', 
                          borderRadius: '4px', background: comorbidities.includes(c) ? 'var(--primary-color)' : 'transparent' 
                        }} />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '16px' }}
                  onClick={handleAnalyzeAndEstimate}
                  disabled={loading || !symptoms.trim()}
                >
                  {loading ? 'Analyzing with AI...' : 'Generate Clinical Estimate'}
                  <ArrowRight size={20} />
                </button>
              </div>

              <div className="glass-panel card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck color="#10b981" /> Data-Backed Intelligence
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Our AI engine cross-references Ayushman Bharat rates, private hospital billing data, and comorbidity multipliers to give you accurate cost anchors.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CreditCard color="#6366f1" /> Pre-Approved Financing
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Instantly push the verified cost anchor to NBFC partners like Poonawalla Fincorp for 0% EMI healthcare loans.</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="main-content split"
            >
              <div>
                <div className="glass-panel card" style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h2 className="title" style={{ fontSize: '24px', marginBottom: '8px' }}>AI Clinical Intent</h2>
                      <p className="gradient-text" style={{ fontSize: '20px', fontWeight: '600' }}>
                        {intentResult?.procedure_name}
                      </p>
                    </div>
                    <div className="tag" style={{ border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                      ICD-10: {intentResult?.icd_code}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    {intentResult?.explanation}
                  </p>
                  <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--success-color)' }}>
                    AI Confidence Score: {(intentResult?.confidence_score * 100).toFixed(1)}%
                  </div>
                </div>

                <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Select Hospital ({location})</h3>
                {estimates.map((est, idx) => (
                  <div 
                    key={idx}
                    className={`glass-panel glass-panel-hover hospital-card ${selectedHospital?.hospital_name === est.hospital_name ? 'selected' : ''}`}
                    onClick={() => setSelectedHospital(est)}
                  >
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{est.hospital_name}</h4>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className={`tag ${est.price_tier === 'Premium' ? 'red' : est.price_tier === 'High' ? 'yellow' : 'green'}`}>
                          {est.price_tier} Price
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Score: {est.quality_score}/10</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary-color)' }}>
                        {formatCurrency(est.estimated_cost)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Estimated Total</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <AnimatePresence mode="wait">
                  {selectedHospital ? (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel card"
                    >
                      <h2 className="title" style={{ fontSize: '24px' }}>Cost Breakdown</h2>
                      <p className="subtitle" style={{ marginBottom: '0' }}>{selectedHospital.hospital_name}</p>
                      
                      <div className="cost-breakdown">
                        {selectedHospital.breakdown.map((item, i) => (
                          <div key={i} className="breakdown-row">
                            <span>{item.category}</span>
                            <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                        <div className="breakdown-row total">
                          <span>Comorbidity-Adjusted Total</span>
                          <span className="gradient-text">{formatCurrency(selectedHospital.estimated_cost)}</span>
                        </div>
                      </div>

                      <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                        <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={18} color="var(--success-color)" /> Verified Anchor
                        </h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                          This estimate has been verified against historical data and your patient risk profile. Applying for a loan using this exact anchor reduces NBFC risk.
                        </p>
                        <button 
                          className="btn-primary" 
                          style={{ width: '100%' }}
                          onClick={handleApplyLoan}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Apply for Healthcare Loan'}
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="glass-panel card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
                      <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Select a hospital to view itemized breakdown and financing options.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 3 && loanResult && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel card"
              style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}
            >
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h1 className="title" style={{ marginBottom: '8px' }}>Loan Approved</h1>
              <p className="subtitle" style={{ marginBottom: '32px' }}>{loanResult.message}</p>
              
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px', textAlign: 'left', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Loan ID</span>
                  <span style={{ fontWeight: '600' }}>{loanResult.loan_id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Patient</span>
                  <span style={{ fontWeight: '600' }}>{loanResult.patient_name || 'Ravi'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Hospital</span>
                  <span style={{ fontWeight: '600' }}>{selectedHospital?.hospital_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--surface-border)', paddingTop: '12px', marginTop: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Approved Amount</span>
                  <span className="gradient-text" style={{ fontSize: '20px', fontWeight: '700' }}>
                    {formatCurrency(loanResult.approved_amount)}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'left', marginBottom: '16px', fontWeight: '600' }}>Select Repayment Plan:</div>
              <div className="main-content split" style={{ gap: '16px' }}>
                {loanResult.emi_options.map((opt, i) => (
                  <div key={i} className="glass-panel glass-panel-hover loan-card" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                      {formatCurrency(opt.emi)}<span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '400' }}>/mo</span>
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>For {opt.tenure_months} months</div>
                    <div className="tag green" style={{ display: 'inline-block' }}>{opt.interest}</div>
                  </div>
                ))}
              </div>
              
              <button className="btn-primary" style={{ marginTop: '32px' }} onClick={() => window.location.reload()}>
                Start New Estimate
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
