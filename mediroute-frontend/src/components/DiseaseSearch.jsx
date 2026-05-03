import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, Info, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

const DiseaseSearch = ({ user, onSearch }) => {
  const [symptomText, setSymptomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState('input');

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/get-questions`, { concern: symptomText });
      setQuestions(response.data.questions || []);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setCurrentStep('questions');
    } catch (err) {
      setError('Failed to generate clarifying questions.');
    } finally { setLoading(false); }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formattedAnswers = questions.map((q, i) => ({ question: q, answer: answers[i] }));
      const response = await axios.post(`${API_BASE_URL}/api/search-disease`, {
        user_id: user.user_id,
        symptom_text: symptomText,
        answers: formattedAnswers
      });
      onSearch(response.data, symptomText);
    } catch (err) {
      setError('Diagnosis failed. Please check your answers.');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 bg-secondary rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
          Phase 2: Clinical Intake
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">What's the medical concern?</h2>
        <p className="text-slate-500 text-lg">Describe your symptoms or procedure needs. Our AI will guide you through a clinical assessment.</p>
      </div>

      <div className="glass-card overflow-hidden relative">
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-10 text-center"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Activity className="w-8 h-8 text-primary absolute inset-0 m-auto animate-pulse" />
              </div>
              <motion.h3 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-8 text-xl font-bold text-slate-900"
              >
                {currentStep === 'input' ? 'Generating Clinical Questions...' : 'Finalizing AI Diagnosis...'}
              </motion.h3>
              <p className="mt-3 text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                Our Institutional Intelligence engine is mapping your input to standardized medical codes.
              </p>
              
              <div className="mt-10 w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentStep === 'input' ? (
            <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-10">
              <form onSubmit={handleInitialSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Primary Symptom / Concern
                  </label>
                  <textarea
                    required
                    className="input-field w-full min-h-[150px] resize-none text-lg py-5"
                    placeholder="Describe your concern briefly (e.g. 'Abdominal pain', 'Knee swelling'...)"
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                  />
                </div>
                <button disabled={loading} type="submit" className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg">
                  <MessageSquare className="w-6 h-6" /> Start Clinical Intake
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-10">
              <div className="mb-10 flex justify-between items-center pb-6 border-b border-slate-100">
                <button onClick={() => setCurrentStep('input')} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest">
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Clarification Step</span>
              </div>
              <form onSubmit={handleFinalSubmit} className="space-y-10">
                {questions.map((q, i) => (
                  <div key={i} className="space-y-4">
                    <label className="text-sm font-bold text-slate-800 leading-relaxed block">
                      {i + 1}. {q}
                    </label>
                    <input required className="input-field w-full" placeholder="Type your response..." value={answers[i]} onChange={(e) => {
                      const newAns = [...answers]; newAns[i] = e.target.value; setAnswers(newAns);
                    }} />
                  </div>
                ))}
                <button disabled={loading} type="submit" className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg">
                  Finalize Analysis <ArrowRight className="w-6 h-6" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-start gap-4 p-8 bg-blue-50 rounded-3xl border border-blue-100">
        <Info className="text-primary w-6 h-6 mt-1 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Institutional Transparency Engine</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            MediRoute AI eliminates "Information Asymmetry" by mapping your answers to standardized Government 
            Medical Codes (ICD-10). This ensures accurate regional cost auditing.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DiseaseSearch;
