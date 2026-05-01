import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, Landmark, ArrowLeft } from 'lucide-react';

const LoanDecision = ({ data, onBack }) => {
  if (!data) return null;

  const { underwriting, summary, overall_confidence } = data;
  const decision = underwriting?.loan_recommendation || 'PENDING';

  const getTheme = () => {
    switch(decision) {
      case 'APPROVE': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
      case 'REVIEW': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle };
      case 'REJECT': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Info };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Decision Card */}
      <div className={`glass-card p-10 text-center relative overflow-hidden border-t-4 ${theme.border}`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${theme.bg}`} />
        <div className={`w-20 h-20 ${theme.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`${theme.color} w-10 h-10`} />
        </div>
        <h2 className={`text-5xl font-black mb-2 tracking-tight ${theme.color}`}>
          {decision}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Landmark className="w-5 h-5 text-teal-400" /> Underwriting Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <span className="text-slate-400">Recommended Loan</span>
              <span className="text-xl font-bold text-white">₹{underwriting?.recommended_loan_amount?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <span className="text-slate-400">Overpricing Percentage</span>
              <span className={`text-xl font-bold ${underwriting?.overpricing_percentage > 20 ? 'text-rose-400' : 'text-teal-400'}`}>
                {underpricing?.overpricing_percentage || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <span className="text-slate-400">Decision Confidence</span>
              <span className="text-xl font-bold text-teal-400">{underwriting?.decision_confidence || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Overall Trust Level</span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-200">
                {overall_confidence}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-center bg-slate-900/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Info className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Auditor's Note</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {underwriting.reason}
              </p>
              {underwriting.fraud_flag && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-medium">
                  🚨 Warning: High deviation from market standards detected.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center pb-20">
        <p className="text-slate-500 text-xs">
          This is an AI-generated clinical audit. Final approval subject to NBFC partner terms and conditions.
        </p>
      </div>
    </motion.div>
  );
};

export default LoanDecision;
