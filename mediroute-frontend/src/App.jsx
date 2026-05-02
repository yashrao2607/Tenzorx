import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, FileCheck, RefreshCcw } from 'lucide-react';
import SymptomForm from './components/SymptomForm';
import CostDashboard from './components/CostDashboard';
import LoanDecision from './components/LoanDecision';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const steps = [
    { id: 1, label: 'Clinical Intake', icon: Shield },
    { id: 2, label: 'Cost Audit', icon: LayoutDashboard },
    { id: 3, label: 'Loan Underwriting', icon: FileCheck },
  ];

  const handleAnalysis = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/full-analysis`, formData);
      setData(response.json || response.data);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError('Unable to reach the MediRoute Intelligence Engine. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8 bg-[#020617]">
      {/* Navbar / Logo */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">MEDIROUTE <span className="text-teal-400">AI</span></h1>
        </div>
        
        {step > 1 && (
          <button 
            onClick={reset}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" /> Start New Audit
          </button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="max-w-xl mx-auto mb-16">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800 -translate-y-1/2 z-0" />
          {steps.map((s) => {
            const Icon = s.icon;
            const active = step >= s.id;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  active ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${active ? 'text-teal-400' : 'text-slate-600'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <SymptomForm key="step1" onSubmit={handleAnalysis} loading={loading} />
          )}
          {step === 2 && (
            <CostDashboard key="step2" data={data} onNext={() => setStep(3)} />
          )}
          {step === 3 && (
            <LoanDecision key="step3" data={data} onBack={() => setStep(2)} />
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pb-10 border-t border-slate-900 pt-8 flex justify-between items-center text-slate-600 text-[10px] uppercase tracking-widest">
        <div>© 2026 MediRoute AI Engine • TenzorX Hackathon</div>
        <div className="flex gap-6">
          <span className="hover:text-teal-400 cursor-pointer">Security Protocol</span>
          <span className="hover:text-teal-400 cursor-pointer">NBFC API Docs</span>
          <span className="hover:text-teal-400 cursor-pointer">ABDM Compliant</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
