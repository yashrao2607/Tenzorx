import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Activity, Info } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

const DiseaseSearch = ({ user, onSearch }) => {
  const [symptomText, setSymptomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/search-disease`, {
        user_id: user.user_id,
        symptom_text: symptomText
      });
      onSearch(response.data, symptomText);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">What's the medical concern?</h2>
        <p className="text-slate-400">Describe your symptoms in natural language (Hindi or English). We'll map them to standardized ICD-10 codes.</p>
      </div>

      <div className="glass-card p-8">
        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" /> Symptoms / Problem
            </label>
            <textarea
              required
              className="input-field w-full min-h-[150px] resize-none text-lg"
              placeholder="e.g. Mere pet mein pathri hai (I have kidney stones), or Chest pain for 2 days..."
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
                AI Mapping to ICD-10...
              </div>
            ) : (
              <>
                <Search className="w-6 h-6" /> Identify Disease Code
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
          <Info className="text-blue-400 w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            MediRoute AI uses Gemini 2.5 Flash to eliminate "Information Asymmetry". By mapping your symptoms to a 
            Standardized Government Medical Code (ICD-10), we ensure you can compare costs across all hospitals 
            on an "Apples-to-Apples" basis.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DiseaseSearch;
