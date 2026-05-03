import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserPlus, Search, MapPin, FileCheck, RefreshCcw, User, X, CreditCard, Phone, AlertCircle } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import DiseaseSearch from './components/DiseaseSearch';
import HospitalMapView from './components/HospitalMapView';
import LoanDecision from './components/LoanDecision';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

function MediRouteFlow() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [user, setUser] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loanResult, setLoanResult] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('mediroute_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setStep(1);
      } catch (err) {
        localStorage.removeItem('mediroute_user');
      }
    }
  }, []);

  const allSteps = [
    { id: 0, label: 'Registration', icon: UserPlus },
    { id: 1, label: 'Analysis', icon: Search },
    { id: 2, label: 'Hospitals', icon: MapPin },
    { id: 3, label: 'Approval', icon: FileCheck },
  ];

  const visibleSteps = user ? allSteps.slice(1) : allSteps;

  const handleRegistration = (userData) => {
    setUser(userData);
    localStorage.setItem('mediroute_user', JSON.stringify(userData));
    setStep(1);
  };

  const handleSearch = (diagnosisData) => {
    setDiagnosis(diagnosisData);
    setStep(2);
  };

  const handleHospitalSelect = async (hospital) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/apply-for-loan`, {
        user_id: user.user_id,
        hospital_id: hospital.hospital_id,
        hospital_name: hospital.hospital_name,
        icd10_code: diagnosis.icd10_code,
        procedure: diagnosis.recommended_procedure,
        requested_amount: hospital.estimated_total_cost,
        city: user.city,
        comorbidities: user.health_records?.comorbidities || []
      });
      setLoanResult(response.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Underwriting failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-outfit pt-10">
      <div className="pb-20 px-4">
        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
            {visibleSteps.map((s) => {
              const Icon = s.icon;
              const active = step >= s.id;
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    active ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${active ? 'text-primary' : 'text-slate-400'}`}>
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
            className="max-w-2xl mx-auto mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm flex items-center gap-3 shadow-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto font-bold opacity-60">Dismiss</button>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 0 && <RegistrationForm key="0" onRegister={handleRegistration} initialData={user} />}
            {step === 1 && <DiseaseSearch key="1" user={user} onSearch={handleSearch} />}
            {step === 2 && <HospitalMapView key="2" user={user} diagnosis={diagnosis} onSelect={handleHospitalSelect} comorbidities={user.health_records?.comorbidities || []} />}
            {step === 3 && <LoanDecision key="3" data={loanResult} onBack={() => setStep(2)} />}
          </AnimatePresence>
        </main>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && user && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary text-2xl font-bold">
                    {user.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900">{user.name}</h4>
                    <p className="text-slate-500">{user.occupation} • {user.age} Years Old</p>
                  </div>
                  <button onClick={() => setShowProfile(false)} className="ml-auto p-2 hover:bg-slate-50 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Aadhaar', val: user.aadhaar },
                    { label: 'PAN', val: user.pan },
                    { label: 'Phone', val: user.phone },
                    { label: 'Location', val: user.city }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{item.label}</p>
                      <p className="text-slate-700 font-bold">{item.val}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => { setStep(0); setShowProfile(false); }}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <h2 className="mt-6 text-xl font-bold text-slate-900">AI Clinical Audit...</h2>
            <p className="mt-2 text-slate-500">Integrating market data for fair underwriting</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MediRouteFlow;
