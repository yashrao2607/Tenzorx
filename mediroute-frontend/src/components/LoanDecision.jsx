import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Activity, ArrowLeft, Shield, Clock, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const LoanDecision = ({ data, onBack }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  if (!data) return null;

  const { decision, fair_market_price, requested_amount, overpricing_pct, recommendation, cheaper_alternative, emi_options, procedure } = data;

  const isApproved = decision === 'APPROVED';
  const isReview = decision === 'REVIEW';

  const handleApply = (plan) => {
    setIsSuccess(true);
    toast.success(`Application submitted for ₹${plan.emi}/mo plan!`);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-2xl mx-auto py-20 text-center space-y-8"
      >
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", damping: 12 }}
            className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-200"
          >
            <Check className="w-16 h-16 stroke-[3]" />
          </motion.div>
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-dashed border-emerald-200 rounded-full"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900">Application Successful!</h2>
          <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed">
            Your financing plan for <span className="text-primary font-bold">{procedure}</span> has been locked in. 
            The hospital has been notified and will contact you within 2 hours.
          </p>
        </div>

        <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl flex items-center gap-6 text-left">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Next Step: Pre-Op Checkup</h4>
            <p className="text-xs text-slate-400 font-medium">Bring your ABHA ID and original Aadhaar card.</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <button 
          onClick={() => window.location.href = '/'}
          className="btn-primary px-10 py-4 text-lg"
        >
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto pb-20">
      <div className="glass-card overflow-hidden">
        {/* Status Header */}
        <div className={`p-10 text-center ${isApproved ? 'bg-emerald-50' : isReview ? 'bg-amber-50' : 'bg-rose-50'}`}>
            {isApproved ? <Check className="w-20 h-20 text-emerald-500 mx-auto mb-4" /> : isReview ? <AlertCircle className="w-20 h-20 text-amber-500 mx-auto mb-4" /> : <X className="w-20 h-20 text-rose-500 mx-auto mb-4" />}
          <h2 className={`text-4xl font-black mb-3 ${isApproved ? 'text-emerald-700' : isReview ? 'text-amber-700' : 'text-rose-700'}`}>
            {decision}
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto font-medium">{recommendation}</p>
        </div>

        <div className="p-10 space-y-10">
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Medical Procedure</p>
              <p className="text-xl font-bold text-slate-900">{procedure}</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center relative overflow-hidden group">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest relative z-10">Total Hospital Bill</p>
              <p className="text-2xl font-black text-slate-900 relative z-10">₹{requested_amount.toLocaleString()}</p>
              <div className="absolute inset-0 bg-rose-50/0 group-hover:bg-rose-50/50 transition-colors" />
            </div>
            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 text-right">
              <p className="text-[10px] uppercase font-black text-primary mb-2 tracking-widest">Regional Fair Price</p>
              <p className="text-2xl font-black text-primary">₹{fair_market_price.toLocaleString()}</p>
            </div>
          </div>

          {/* Funding Split (Option 1) - Redesigned for Premium Aesthetics */}
          <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Funding Split</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Verified via ABHA Digital Health Records</p>
              </div>
              <div className="px-4 py-1.5 bg-white shadow-sm border border-slate-100 text-primary text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Hybrid Approval Active
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              {/* The Progress Bar */}
              <div className="relative h-14 bg-white rounded-3xl p-1.5 border border-slate-100 shadow-sm flex overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.insurance_coverage / data.requested_amount) * 100}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.gap_loan_amount / data.requested_amount) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-2xl ml-1 relative overflow-hidden group"
                >
                   <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>

              {/* Enhanced Legend */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PM-JAY Coverage</p>
                    <p className="text-xl font-black text-slate-900">₹{data.insurance_coverage?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MediRoute Gap Loan</p>
                    <p className="text-xl font-black text-slate-900">₹{data.gap_loan_amount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>

          {/* Final Loan Callout */}
          <div className="p-8 bg-primary rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-primary/20 border-4 border-white">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
                <Check className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Final Approved Loan</p>
                <h4 className="text-4xl font-black">₹{data.gap_loan_amount?.toLocaleString()}</h4>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold opacity-80">You saved ₹{data.insurance_coverage?.toLocaleString()}</p>
              <p className="text-[10px] uppercase font-black opacity-40">via Institutional Gap Funding</p>
            </div>
          </div>

          {/* EMI Options */}
          {emi_options && emi_options.length > 0 && (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="text-primary w-6 h-6" /> 
                  <h3 className="text-xl font-bold text-slate-900">Available Financing Options</h3>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emi_options.map((opt, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-primary transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-2xl font-black text-slate-900">₹{opt.emi.toLocaleString()} <span className="text-xs text-slate-400 font-bold">/mo</span></p>
                        <p className="text-sm font-bold text-primary mt-1">{opt.tenure_months} Months Tenure</p>
                      </div>
                      <div className="px-3 py-1 bg-secondary text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                        {opt.interest}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApply(opt)}
                      className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-primary transition-colors flex items-center justify-center gap-2"
                    >
                      Apply with This Plan <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Suggestion */}
          {cheaper_alternative && (
            <div className="p-8 bg-primary text-white rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                  <Activity className="w-6 h-6" />
                <h4 className="text-2xl font-bold mb-2">Switch to {cheaper_alternative.hospital_name}</h4>
                <p className="text-white/80 text-sm mb-6 max-w-md">
                  You can save up to <strong className="text-white text-lg">₹{cheaper_alternative.savings.toLocaleString()}</strong> by switching to this equally-rated provider.
                </p>
                <button onClick={onBack} className="bg-white text-primary font-black py-4 px-8 rounded-2xl flex items-center gap-3 hover:bg-secondary transition-all">
                  Compare Other Hospitals <ArrowRight className="w-5 h-5" />
                </button>
              </div>
                <Shield className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
            </div>
          )}

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row gap-6">
            <button onClick={onBack} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              <ArrowLeft className="w-4 h-4" /> Adjust Selection
            </button>
            <button className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold cursor-not-allowed">
              <Clock className="w-4 h-4 inline mr-2" /> Download Detailed Audit Report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ArrowRight = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>;

export default LoanDecision;
