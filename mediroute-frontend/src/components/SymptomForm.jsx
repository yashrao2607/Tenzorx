import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, MapPin, AlertCircle, IndianRupee } from 'lucide-react';

const SymptomForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    symptom_text: '',
    city: 'Delhi',
    comorbidities: [],
    requested_loan_amount: 150000
  });

  const cities = ['Delhi', 'Mumbai', 'Bangalore'];
  const comorbidityOptions = [
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'heart_disease', label: 'Heart Disease' }
  ];

  const handleComorbidityToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(id)
        ? prev.comorbidities.filter(item => item !== id)
        : [...prev.comorbidities, id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-500/10 rounded-lg">
          <Activity className="text-teal-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Clinical Intake</h2>
          <p className="text-slate-400">Describe your symptoms for an AI-powered financial audit.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Symptoms & Condition</label>
          <textarea
            required
            className="input-field w-full min-h-[120px] resize-none"
            placeholder="e.g. Severe abdominal pain, nausea, and fever since last night..."
            value={formData.symptom_text}
            onChange={(e) => setFormData({ ...formData, symptom_text: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" /> City
            </label>
            <select
              className="input-field w-full appearance-none"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-teal-400" /> Requested Loan Amount
            </label>
            <input
              type="number"
              className="input-field w-full"
              value={formData.requested_loan_amount}
              onChange={(e) => setFormData({ ...formData, requested_loan_amount: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-teal-400" /> Pre-existing Conditions
          </label>
          <div className="flex flex-wrap gap-3">
            {comorbidityOptions.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleComorbidityToggle(option.id)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  formData.comorbidities.includes(option.id)
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing Medical Data...
            </div>
          ) : 'Analyze Clinical Case'}
        </button>
      </form>
    </motion.div>
  );
};

export default SymptomForm;
