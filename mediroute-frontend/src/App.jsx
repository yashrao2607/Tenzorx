import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserPlus, Search, MapPin, FileCheck, RefreshCcw, User, X, CreditCard, Phone, Briefcase, AlertCircle } from 'lucide-react';
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
  const [showProfile, setShowProfile] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mediroute_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setStep(1); // Skip registration if user exists
      } catch (err) {
        console.error("Failed to parse saved user", err);
        localStorage.removeItem('mediroute_user');
      }
    }
  }, []);

  const allSteps = [
    { id: 0, label: 'Registration', icon: UserPlus },
    { id: 1, label: 'Disease Search', icon: Search },
    { id: 2, label: 'Hospital Map', icon: MapPin },
    { id: 3, label: 'Loan Decision', icon: FileCheck },
  ];

  const visibleSteps = user ? allSteps.slice(1) : allSteps;

  const handleRegistration = (userData) => {
    // Combine backend response with local payload if needed, 
    // or just store what the backend gives plus the local city if it's there.
    // The backend returns user_id and city.
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
      setError(err.response?.data?.detail || 'Underwriting failed. The server might be busy or the data is invalid.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1); // Go back to search, not registration
    setDiagnosis(null);
    setLoanResult(null);
    setError(null);
  };

  const fullReset = () => {
    setStep(0);
    setUser(null);
    setDiagnosis(null);
    setLoanResult(null);
    setError(null);
    localStorage.removeItem('mediroute_user');
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
          <div className="flex gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-teal-400 font-bold text-xs border border-slate-700">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-slate-300 text-sm font-medium">{user?.name || 'User'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Step Indicator */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800 -translate-y-1/2 z-0" />
          {visibleSteps.map((s) => {
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

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
              <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-400 w-8 h-8" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-white tracking-tight">AI Underwriting in Progress</h2>
            <p className="mt-2 text-slate-400 text-sm">Validating cost transparency and loan eligibility...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center flex items-center justify-center gap-3"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-xs underline opacity-50 hover:opacity-100">Dismiss</button>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <RegistrationForm 
              key="step0" 
              onRegister={handleRegistration} 
              loading={loading} 
              initialData={user}
            />
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

      {/* Floating Profile Button */}
      {user && (
        <button
          onClick={() => setShowProfile(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-teal-500/30 hover:scale-110 transition-transform z-50 group"
        >
          <User className="w-6 h-6" />
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-800">
            View My Profile
          </span>
        </button>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && user && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Patient Profile</h3>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-5 pb-6 border-b border-slate-800/50">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 text-2xl font-black border border-teal-500/20">
                    {user.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{user.name}</h4>
                    <p className="text-slate-400">{user.occupation} • {user.age} Years Old</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-2 text-teal-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                      <CreditCard className="w-3 h-3" /> Aadhaar
                    </div>
                    <p className="text-slate-200 font-medium">{user.aadhaar}</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-2 text-teal-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                      <CreditCard className="w-3 h-3" /> PAN
                    </div>
                    <p className="text-slate-200 font-medium">{user.pan}</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-2 text-teal-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                      <Phone className="w-3 h-3" /> Phone
                    </div>
                    <p className="text-slate-200 font-medium">{user.phone}</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-2 text-teal-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                      <MapPin className="w-3 h-3" /> Location
                    </div>
                    <p className="text-slate-200 font-medium">{user.city}</p>
                  </div>
                </div>

                <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl">
                  <div className="text-[10px] uppercase tracking-widest text-teal-400 font-bold mb-2">Internal UID</div>
                  <p className="text-xs font-mono text-slate-400">{user.user_id}</p>
                </div>
              </div>

              <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
                <button 
                  onClick={() => {
                    setStep(0);
                    setShowProfile(false);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-xl transition-colors font-bold text-sm border border-teal-500/20"
                >
                  <RefreshCcw className="w-4 h-4" /> Edit Profile
                </button>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-sm"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
