import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, Info, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

const DiseaseSearch = ({ user, onSearch }) => {
  const [symptomText, setSymptomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Multi-turn states
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState('input'); // 'input' or 'questions'

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/get-questions`, {
        concern: symptomText
      });
      setQuestions(response.data.questions || []);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setCurrentStep('questions');
    } catch (err) {
      setError('Failed to generate clarifying questions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Format answers for the backend
      const formattedAnswers = questions.map((q, i) => ({
        question: q,
        answer: answers[i]
      }));

      const response = await axios.post(`${API_BASE_URL}/api/search-disease`, {
        user_id: user.user_id,
        symptom_text: symptomText,
        answers: formattedAnswers
      });
      onSearch(response.data, symptomText);
    } catch (err) {
      setError('Diagnosis failed. Please check your answers and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (index, val) => {
    const newAnswers = [...answers];
    newAnswers[index] = val;
    setAnswers(newAnswers);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto pb-20"
    >
      <div className="text-center mb-12">
        {user?.name && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-[10px] uppercase tracking-widest font-bold mb-4"
          >
            Clinical Intake Session • {user.name}
          </motion.div>
        )}
        <h2 className="text-4xl font-bold mb-4">Medical Analysis Engine</h2>
        <p className="text-slate-400">Our AI uses clinical logic to narrow down your condition through targeted questions.</p>
      </div>

      <div className="glass-card p-1">
        <AnimatePresence mode="wait">
          {currentStep === 'input' ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8"
            >
              <form onSubmit={handleInitialSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" /> Primary Symptom / Concern
                  </label>
                  <textarea
                    required
                    className="input-field w-full min-h-[150px] resize-none text-lg"
                    placeholder="Describe your concern briefly (e.g. 'Abdominal pain', 'Knee swelling'...)"
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing Concern...
                    </div>
                  ) : (
                    <>
                      <MessageSquare className="w-6 h-6" /> Start Clinical Intake
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8"
            >
              <div className="mb-8 flex justify-between items-center">
                <button 
                  onClick={() => setCurrentStep('input')}
                  className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <div className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.2em] px-3 py-1 bg-teal-500/10 rounded-full">
                  Phase 2: Clarification
                </div>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-8">
                {questions.map((q, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="space-y-3"
                  >
                    <label className="text-sm font-bold text-slate-200 block leading-relaxed">
                      {i + 1}. {q}
                    </label>
                    <input 
                      required
                      className="input-field w-full"
                      placeholder="Your answer..."
                      value={answers[i]}
                      onChange={(e) => updateAnswer(i, e.target.value)}
                    />
                  </motion.div>
                ))}

                <button
                  disabled={loading}
                  type="submit"
                  className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Final Diagnosis...
                    </div>
                  ) : (
                    <>
                      Finalize Analysis <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      <div className="mt-8 flex items-start gap-3 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
        <Info className="text-blue-400 w-6 h-6 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-slate-300 mb-1">Standardized Medical Intake</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            By answering these clarifying questions, our AI can more accurately map your condition to a 
            specific ICD-10 code. This reduces errors in cost estimation and ensures that the underwriting 
            is based on your specific clinical profile.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DiseaseSearch;
