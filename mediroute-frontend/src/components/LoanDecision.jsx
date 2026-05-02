import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, Landmark, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

const LoanDecision = ({ data, onBack, isPhase2 = false }) => {
  if (!data) return null;

  // Handle both Phase 1 and Phase 2 data structures
  const decision = isPhase2 ? data.decision : (data.underwriting?.loan_recommendation || 'PENDING');
  const recommendationText = isPhase2 ? data.recommendation : data.summary;
  const fairMarketPrice = isPhase2 ? data.fair_market_price : data.cost_analysis?.base_cost_estimate;
  const overpricingPct = isPhase2 ? data.overpricing_pct : data.underwriting?.overpricing_percentage;

  const getTheme = () => {
    switch(decision) {
      case 'APPROVE':
      case 'APPROVED': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
      case 'REVIEW': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle };
      case 'REJECT':
      case 'REJECTED': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: XCircle };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Info };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Map View
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
          {recommendationText}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Landmark className="w-5 h-5 text-teal-400" /> Underwriting Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <span className="text-slate-400">Fair Market Price (FMP)</span>
              <span className="text-xl font-bold text-white">₹{fairMarketPrice?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <span className="text-slate-400">Requested Amount</span>
              <span className="text-xl font-bold text-white">₹{data.requested_amount?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <span className="text-slate-400">Inflation Deviation</span>
              <span className={`text-xl font-bold ${overpricingPct > 10 ? 'text-rose-400' : 'text-teal-400'}`}>
                {overpricingPct || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Regional Pricing Trust</span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-200 uppercase tracking-widest">
                ICD-10 VALIDATED
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {data.cheaper_alternative && (
            <div className="glass-card p-8 bg-blue-500/5 border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <ShieldCheck className="text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Smart Recommendation</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    We found a cheaper alternative for the same medical code in your city.
                  </p>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">{data.cheaper_alternative.hospital_name}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-lg font-black text-white">₹{data.cheaper_alternative.cost.toLocaleString()}</p>
                      <p className="text-sm font-bold text-emerald-400">Save ₹{data.cheaper_alternative.savings.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.emi_options && data.emi_options.length > 0 && (
            <div className="glass-card p-8">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-teal-400" /> EMI Payment Options
              </h4>
              <div className="space-y-4">
                {data.emi_options.map((opt, i) => (
                  <div key={i} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-black text-white">₹{opt.emi.toLocaleString()}/mo</p>
                      <p className="text-xs text-slate-500 font-bold uppercase">{opt.tenure_months} Months • {opt.interest}</p>
                    </div>
                    <button className="text-teal-400 hover:text-teal-300 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LoanDecision;
