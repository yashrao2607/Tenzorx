import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, MapPin, CheckCircle, ArrowRight, ShieldCheck, CreditCard, ActivitySquare, ChevronRight, BrainCircuit, HeartPulse, ShieldAlert, BadgeIndianRupee, Info, TrendingUp, AlertTriangle } from 'lucide-react';
import './index.css';

const API_BASE = 'http://localhost:8000/api';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('Nagpur');
  const [age, setAge] = useState(55);
  const [comorbidities, setComorbidities] = useState([]);
  
  // API Results
  const [intentResult, setIntentResult] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [requestedAmount, setRequestedAmount] = useState(null);
  const [loanResult, setLoanResult] = useState(null);

  const COMORBIDITIES_LIST = ["Diabetes", "Hypertension", "Cardiac Disease", "Age > 60"];
  const CITIES = ["Nagpur", "Mumbai", "Pune", "Delhi", "Bangalore"];

  const handleToggleComorbidity = (item) => {
    if (comorbidities.includes(item)) {
      setComorbidities(comorbidities.filter(c => c !== item));
    } else {
      setComorbidities([...comorbidities, item]);
    }
  };

  // Live Update logic (What-if Simulator)
  const updateEstimatesLive = useCallback(async () => {
    if (!intentResult) return;
    
    try {
      const finalComorbidities = [...comorbidities];
      if (age > 60 && !finalComorbidities.includes("Age > 60")) {
        finalComorbidities.push("Age > 60");
      }

      const estRes = await fetch(`${API_BASE}/update-comorbidity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedure_name: intentResult.procedure_name,
          comorbidities: finalComorbidities,
          location
        })
      });
      const estData = await estRes.json();
      setEstimates(estData);
      
      // Keep selection if possible
      if (selectedHospital) {
        const updated = estData.find(h => h.hospital_name === selectedHospital.hospital_name);
        if (updated) setSelectedHospital(updated);
      }
    } catch (error) {
      console.error("Live update error:", error);
    }
  }, [intentResult, comorbidities, age, location, selectedHospital]);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        updateEstimatesLive();
      }, 500); // Debounce
      return () => clearTimeout(timer);
    }
  }, [comorbidities, age, location, step]);

  const handleAnalyzeAndEstimate = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const intentRes = await fetch(`${API_BASE}/analyze-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, age, location })
      });
      const intentData = await intentRes.json();
      setIntentResult(intentData);

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
      
      // Artificial delay for UI dramatic effect
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1500);
      
    } catch (error) {
      console.error("Error calling API:", error);
      alert("Backend API is not running or unreachable.");
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
          patient_name: patientName || "John Doe",
          hospital_name: selectedHospital.hospital_name,
          procedure_name: intentResult.procedure_name,
          amount: requestedAmount || selectedHospital.estimated_cost,
          estimated_cost: selectedHospital.estimated_cost
        })
      });
      const loanData = await loanRes.json();
      
      setTimeout(() => {
        setLoanResult(loanData);
        setStep(3);
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error calling API:", error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <>
      <div className="bg-blobs">
        <div className="bg-grid"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="app-container">
        <header className="header">
          <div className="logo">
            <div className="logo-icon-wrap">
              <ActivitySquare color="#06b6d4" size={36} />
            </div>
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
            {step === 1 && !loading && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
                transition={{ duration: 0.5 }}
                className="main-content split"
              >
                <div className="glass-panel card">
                  <h1 className="title" style={{ fontSize: '42px', lineHeight: 1.1, marginBottom: '16px' }}>
                    Clinical <span className="gradient-text">Intelligence.</span><br/>
                    Financial <span className="gradient-text">Certainty.</span>
                  </h1>
                  <p className="subtitle" style={{ fontSize: '16px', maxWidth: '90%' }}>
                    Our AI-driven engine maps clinical symptoms to procedural costs, adjusting for risk comorbidities to anchor pre-approved healthcare loans.
                  </p>

                  <div className="form-group">
                    <label className="form-label">Symptoms or Condition</label>
                    <textarea 
                      className="input-field" 
                      rows={4} 
                      placeholder="e.g., Severe knee pain, difficulty walking, need a replacement..."
                      value={symptoms}
                      onChange={e => setSymptoms(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Patient Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g., Ramesh Kumar"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                    <div>
                      <label className="form-label">Location</label>
                      <select className="input-field" value={location} onChange={e => setLocation(e.target.value)}>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Patient Age: <span className="gradient-text" style={{ fontSize: '18px', fontWeight: 'bold' }}>{age}</span></label>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        className="slider" 
                        value={age} 
                        onChange={e => setAge(parseInt(e.target.value))} 
                        style={{ width: '100%', accentColor: 'var(--primary-color)', height: '8px', borderRadius: '4px', cursor: 'pointer' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HeartPulse size={18} color="var(--primary-color)"/> Pre-existing Conditions
                    </label>
                    <motion.div className="checkbox-grid" variants={staggerContainer} initial="hidden" animate="show">
                      {COMORBIDITIES_LIST.map(c => (
                        <motion.div 
                          variants={staggerItem}
                          key={c} 
                          className={`checkbox-label ${comorbidities.includes(c) ? 'selected' : ''}`}
                          onClick={() => handleToggleComorbidity(c)}
                          style={{
                            padding: '12px',
                            fontSize: '13px',
                            borderRadius: '10px',
                            background: comorbidities.includes(c) ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                            border: comorbidities.includes(c) ? '1px solid var(--primary-color)' : '1px solid var(--surface-border)'
                          }}
                        >
                          <div className="checkbox-icon" style={{ width: '16px', height: '16px', borderRadius: '4px' }}>
                            {comorbidities.includes(c) && <motion.div initial={{scale:0}} animate={{scale:1}}><CheckCircle size={12} /></motion.div>}
                          </div>
                          {c}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={handleAnalyzeAndEstimate}
                    disabled={!symptoms.trim()}
                  >
                    Generate Clinical Estimate
                    <ArrowRight size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '24px' }}>
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                    className="glass-panel glass-panel-hover card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div className="logo-icon-wrap" style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                        <ShieldAlert color="#10b981" />
                      </div>
                      <h3 style={{ fontSize: '22px' }}>Clinical Risk Adjuster</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>Our proprietary engine applies evidence-based comorbidity multipliers to ensure NBFC lenders approve exact amounts, avoiding under-financing.</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                    className="glass-panel glass-panel-hover card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div className="logo-icon-wrap" style={{ width: '48px', height: '48px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
                        <BadgeIndianRupee color="#8b5cf6" />
                      </div>
                      <h3 style={{ fontSize: '22px' }}>Verified NBFC Anchors</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>By predicting itemized hospital bills using AI, we eliminate 72% of NPA risk associated with healthcare over-borrowing.</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                className="glass-panel card"
                style={{ maxWidth: '500px', margin: '100px auto', textAlign: 'center' }}
              >
                <div className="pulse-loader">
                  <div className="pulse-circle"></div>
                  <BrainCircuit size={40} className="pulse-icon" />
                </div>
                <h2 className="title" style={{ fontSize: '28px' }}>Processing Clinical Data</h2>
                <p className="subtitle">Mapping symptoms to ICD-10 and querying hospital pricing matrices...</p>
              </motion.div>
            )}

            {step === 2 && !loading && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="main-content split"
              >
                <div>
                  <div className="glass-panel card" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h2 className="form-label" style={{ marginBottom: '8px' }}>AI Clinical Intent Match</h2>
                        <p className="gradient-text" style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1.2 }}>
                          {intentResult?.procedure_name}
                        </p>
                      </div>
                      <div className="tag outline">
                        ICD-10: {intentResult?.icd_code}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
                      {intentResult?.explanation}
                    </p>
                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--success-color)' }}>
                      <CheckCircle size={16} /> Clinical Match Confidence: {(intentResult?.confidence_score * 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* What-if Simulator Controls */}
                  <div className="glass-panel card" style={{ marginBottom: '32px', padding: '24px' }}>
                    <h3 className="form-label" style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BrainCircuit size={16} color="var(--primary-color)" /> What-if Simulator
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Adjust Age: <span className="gradient-text">{age}</span></label>
                      <input 
                        type="range" min="1" max="100" className="slider" 
                        value={age} onChange={e => setAge(parseInt(e.target.value))} 
                        style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '12px' }}>Toggle Conditions</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {COMORBIDITIES_LIST.map(c => (
                          <div 
                            key={c}
                            onClick={() => handleToggleComorbidity(c)}
                            style={{ 
                              padding: '6px 12px', 
                              borderRadius: '8px', 
                              fontSize: '12px', 
                              cursor: 'pointer',
                              border: '1px solid var(--surface-border)',
                              background: comorbidities.includes(c) ? 'rgba(6, 182, 212, 0.2)' : 'rgba(0,0,0,0.2)',
                              color: comorbidities.includes(c) ? 'var(--primary-color)' : 'var(--text-secondary)',
                              transition: 'all 0.2s'
                            }}
                          >
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 700 }}>Ranked Providers in {location}</h3>
                  <motion.div variants={staggerContainer} initial="hidden" animate="show">
                    {estimates.map((est, idx) => (
                      <motion.div 
                        variants={staggerItem}
                        key={idx}
                        className={`glass-panel glass-panel-hover hospital-card ${selectedHospital?.hospital_name === est.hospital_name ? 'selected' : ''}`}
                        onClick={() => setSelectedHospital(est)}
                      >
                        <div>
                          <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{est.hospital_name}</h4>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span className={`tag ${est.price_tier === 'Premium' ? 'red' : est.price_tier === 'High' ? 'yellow' : 'green'}`}>
                              {est.price_tier} Tier
                            </span>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Score: {est.quality_score}/10</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className="gradient-text" style={{ fontSize: '20px', fontWeight: '800' }}>
                            {formatCurrency(est.min_cost)} - {formatCurrency(est.max_cost)}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>AI Range Estimate</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div style={{ position: 'sticky', top: '40px' }}>
                  <AnimatePresence mode="wait">
                    {selectedHospital ? (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="glass-panel card"
                      >
                        <h2 className="title" style={{ fontSize: '28px', marginBottom: '4px' }}>Cost Breakdown</h2>
                        <p className="subtitle" style={{ marginBottom: '0' }}>{selectedHospital.hospital_name}</p>
                        
                        <div className="cost-breakdown">
                          <h4 className="form-label" style={{ fontSize: '12px', marginBottom: '16px' }}>Itemized AI Prediction</h4>
                          {selectedHospital.breakdown.map((item, i) => (
                            <div key={i} style={{ marginBottom: '16px' }}>
                              <div className="breakdown-row" style={{ marginBottom: '8px', border: 'none' }}>
                                <span>{item.category}</span>
                                <span>{formatCurrency(item.amount)}</span>
                              </div>
                              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(item.amount / selectedHospital.estimated_cost) * 100}%` }}
                                  style={{ height: '100%', background: i % 2 === 0 ? 'var(--primary-color)' : 'var(--secondary-color)' }}
                                />
                              </div>
                            </div>
                          ))}
                          <div className="breakdown-row total" style={{ marginTop: '24px' }}>
                            <span>Total (Avg)</span>
                            <span className="gradient-text">{formatCurrency(selectedHospital.estimated_cost)}</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                          <div className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                              <Info size={12} /> Confidence
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--success-color)' }}>
                              {(selectedHospital.confidence_score * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="glass-panel" style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                              <TrendingUp size={12} /> Quality
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                              {selectedHospital.quality_score}/10
                            </div>
                          </div>
                        </div>

                        <div className="info-box" style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid var(--primary-glow)', marginTop: '24px' }}>
                          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--primary-color)', marginBottom: '8px' }}>
                            <BrainCircuit size={16} /> Why this Provider?
                          </h4>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {selectedHospital.why_this_hospital} {selectedHospital.confidence_explanation}
                          </p>
                        </div>

                        <div className="info-box">
                          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-color)' }}>
                            <ShieldCheck size={20} /> Verified NBFC Anchor
                          </h4>
                          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                            This estimate includes specific risk adjustments for the patient's comorbidities. Using this anchor eliminates over-financing risks for our lending partners.
                          </p>
                          <div style={{ marginBottom: '16px' }}>
                            <label className="form-label" style={{ fontSize: '13px' }}>Requested Loan Amount (Editable for Fraud Demo)</label>
                            <input 
                              type="number" 
                              className="input-field" 
                              value={requestedAmount !== null ? requestedAmount : selectedHospital.estimated_cost}
                              onChange={e => setRequestedAmount(parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <button 
                            className="btn-primary" 
                            style={{ width: '100%', fontSize: '16px' }}
                            onClick={handleApplyLoan}
                          >
                            Send to NBFC (Poonawalla)
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="glass-panel card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '500px', borderStyle: 'dashed' }}>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '18px' }}>Select a hospital provider to view the itemized AI breakdown and unlock 0% EMI financing.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 3 && !loading && loanResult && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="glass-panel card"
                style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '60px 40px' }}
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }} 
                  animate={{ scale: 1, rotate: 0 }} 
                  transition={{ delay: 0.2, type: 'spring' }}
                  className={loanResult.is_fraud_flagged ? "fraud-icon" : "success-icon"}
                  style={loanResult.is_fraud_flagged ? {
                    width: '100px', height: '100px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
                    color: 'var(--danger-color)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 32px', fontSize: '48px',
                    boxShadow: '0 0 40px rgba(239, 68, 68, 0.2), inset 0 0 20px rgba(239, 68, 68, 0.4)',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  } : {}}
                >
                  {loanResult.is_fraud_flagged ? <ShieldAlert size={56} /> : <CheckCircle size={56} />}
                </motion.div>
                
                <h1 className="title" style={{ marginBottom: '12px', color: loanResult.is_fraud_flagged ? 'var(--danger-color)' : 'inherit' }}>
                  {loanResult.is_fraud_flagged ? "Review Required" : "Loan Pre-Approved!"}
                </h1>
                <p className="subtitle" style={{ marginBottom: '40px', color: loanResult.is_fraud_flagged ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                  {loanResult.message}
                </p>
                
                <div className="glass-panel" style={{ padding: '32px', textAlign: 'left', marginBottom: '40px', background: 'rgba(0,0,0,0.4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Loan Application ID</span>
                    <span style={{ fontWeight: '600' }}>{loanResult.loan_id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Patient Name</span>
                    <span style={{ fontWeight: '600' }}>{loanResult.patient_name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CIBIL / Risk Score</span>
                    <span style={{ fontWeight: '600', color: loanResult.patient_risk_score > 750 ? 'var(--success-color)' : 'var(--warning-color)' }}>
                      {loanResult.patient_risk_score}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '16px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Healthcare Provider</span>
                    <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{selectedHospital?.hospital_name}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--surface-border)', paddingTop: '24px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Approved Amount</span>
                    <span className="gradient-text" style={{ fontSize: '36px', fontWeight: '800' }}>
                      {formatCurrency(loanResult.approved_amount)}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'left', marginBottom: '20px', fontWeight: '700', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Select Repayment Plan
                </div>
                
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="main-content split" style={{ gap: '20px' }}>
                  {loanResult.emi_options.map((opt, i) => (
                    <motion.div variants={staggerItem} key={i} className="glass-panel glass-panel-hover loan-card" style={{ cursor: 'pointer' }}>
                      <div className="gradient-text-alt" style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                        {formatCurrency(opt.emi)}<span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>/mo</span>
                      </div>
                      <div style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-secondary)' }}>For {opt.tenure_months} months</div>
                      <div className="tag green">{opt.interest}</div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <button className="btn-primary" style={{ marginTop: '48px' }} onClick={() => window.location.reload()}>
                  Start New Patient Flow
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
