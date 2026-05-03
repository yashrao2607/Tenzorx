import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Briefcase, CreditCard, Users, Star, ArrowRight } from 'lucide-react';

const FinancialForm = ({ onSubmit, treatmentCost, hospitalName }) => {
  const [formData, setFormData] = useState({
    monthly_income: '',
    employment_type: 'Salaried',
    existing_emis: '0',
    credit_score: '750',
    dependents: '0'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monthly_income: Number(formData.monthly_income),
      existing_emis: Number(formData.existing_emis),
      credit_score: Number(formData.credit_score),
      dependents: Number(formData.dependents),
      treatment_cost: treatmentCost,
      hospital_name: hospitalName,
      condition_severity: 'medium', // Default for now
      insurance_coverage: 0 // Will be calculated by backend
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Financial Eligibility</h2>
          <p className="text-slate-500 font-medium">Verify your credit profile for instant treatment approval.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Income */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Monthly Net Income</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="number"
                  name="monthly_income"
                  required
                  placeholder="e.g. 50000"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  value={formData.monthly_income}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Employment Type</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  name="employment_type"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold appearance-none"
                  value={formData.employment_type}
                  onChange={handleChange}
                >
                  <option>Salaried</option>
                  <option>Self-Employed</option>
                  <option>Business Owner</option>
                  <option>Student/Other</option>
                </select>
              </div>
            </div>

            {/* Existing EMIs */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Monthly EMIs</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="number"
                  name="existing_emis"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  value={formData.existing_emis}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Credit Score */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Credit Score (Estimate)</label>
              <div className="relative">
                <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="number"
                  name="credit_score"
                  required
                  placeholder="300-900"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                  value={formData.credit_score}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Dependents */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Number of Dependents</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="number"
                name="dependents"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                value={formData.dependents}
                onChange={handleChange}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Run Financial Check <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default FinancialForm;
