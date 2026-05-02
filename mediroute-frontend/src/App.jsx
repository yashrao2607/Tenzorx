import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserPlus, Search, MapPin, FileCheck, RefreshCcw } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import DiseaseSearch from './components/DiseaseSearch';
import HospitalMapView from './components/HospitalMapView';
import LoanDecision from './components/LoanDecision';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Phase 2 State
  const [user, setUser] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loanResult, setLoanResult] = useState(null);

  const steps = [
    { id: 0, label: 'Registration', icon: UserPlus },
    { id: 1, label: 'Disease Search', icon: Search },
    { id: 2, label: 'Hospital Map', icon: MapPin },
    { id: 3, label: 'Loan Decision', icon: FileCheck },
  ];

  const handleRegistration = (userData) => {
    setUser(userData);
    setStep(1);
  };

  const handleSearch = (diagnosisData) => {
    setDiagnosis(diagnosisData);
    setStep(2);
  };

  const handleHospitalSelect = async (hospital) => {
    setLoading(true);
    try {
      // For underwriting, we need to provide a "requested amount". 
      // By default, we'll request exactly what the hospital costs.
      const response = await axios.post(`${API_BASE_URL}/api/apply-for-loan`, {
        user_id: user.user_id,
        hospital_id: hospital.hospital_id,
        hospital_name: hospital.hospital_name,
        icd10_code: diagnosis.icd10_code,
        procedure: diagnosis.recommended_procedure,
        requested_amount: hospital.estimated_total_cost,
        city: user.city
      });
      setLoanResult(response.data);
      setStep(3);
    } catch (err) {
      setError('Underwriting failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setUser(null);
    setDiagnosis(null);
    setLoanResult(null);
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
        
        {step > 0 && (
          <button 
            onClick={reset}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" /> Start New Audit
          </button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="max-w-2xl mx-auto mb-16">
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
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <RegistrationForm key="step0" onRegister={handleRegistration} loading={loading} />
          )}
          {step === 1 && (
            <DiseaseSearch key="step1" user={user} onSearch={handleSearch} />
          )}
          {step === 2 && (
            <HospitalMapView key="step2" user={user} diagnosis={diagnosis} onSelect={handleHospitalSelect} />
          )}
          {step === 3 && (
            <LoanDecision key="step3" data={loanResult} onBack={() => setStep(2)} isPhase2={true} />
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
