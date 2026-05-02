import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, TrendingDown, ArrowLeft, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

const LoanDecision = ({ data, onBack }) => {
  if (!data) return null;

  const { decision, fair_market_price, requested_amount, overpricing_pct, recommendation, cheaper_alternative, emi_options, procedure } = data;

  const isApproved = decision === 'APPROVED';
  const isReview = decision === 'REVIEW';

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto pb-20">
      <div className="glass-card overflow-hidden">
        {/* Status Header */}
        <div className={`p-10 text-center ${isApproved ? 'bg-emerald-50' : isReview ? 'bg-amber-50' : 'bg-rose-50'}`}>
          <div className="flex justify-center mb-6">
            {isApproved ? <CheckCircle2 className="w-20 h-20 text-emerald-500" /> : isReview ? <AlertCircle className="w-20 h-20 text-amber-500" /> : <XCircle className="w-20 h-20 text-rose-500" />}
          </div>
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
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
              <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Requested Loan</p>
              <p className="text-2xl font-black text-slate-900">₹{requested_amount.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 text-right">
              <p className="text-[10px] uppercase font-black text-primary mb-2 tracking-widest">Regional Fair Price</p>
              <p className="text-2xl font-black text-primary">₹{fair_market_price.toLocaleString()}</p>
            </div>
          </div>

          {/* Alert for Overpricing */}
          {overpricing_pct > 0 && (
            <div className={`p-6 rounded-3xl flex items-start gap-4 border ${isApproved ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}`}>
              <AlertCircle className={`w-6 h-6 shrink-0 ${isApproved ? 'text-amber-500' : 'text-rose-500'}`} />
              <div>
                <h4 className={`font-bold mb-1 ${isApproved ? 'text-amber-800' : 'text-rose-800'}`}>Price Inflation Detected</h4>
                <p className={`text-sm ${isApproved ? 'text-amber-700' : 'text-rose-700'}`}>
                  The selected hospital is charging <strong>{overpricing_pct}% more</strong> than the regional market average.
                </p>
              </div>
            </div>
          )}

          {/* EMI Options */}
          {emi_options && emi_options.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <ShieldCheck className="text-primary w-6 h-6" /> Available Financing Options
              </h3>
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
                    <button className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-primary transition-colors flex items-center justify-center gap-2">
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
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-6 h-6" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Smart Recommendation</span>
                </div>
                <h4 className="text-2xl font-bold mb-2">Switch to {cheaper_alternative.hospital_name}</h4>
                <p className="text-white/80 text-sm mb-6 max-w-md">
                  You can save up to <strong className="text-white text-lg">₹{cheaper_alternative.savings.toLocaleString()}</strong> by switching to this equally-rated provider.
                </p>
                <button onClick={onBack} className="bg-white text-primary font-black py-4 px-8 rounded-2xl flex items-center gap-3 hover:bg-secondary transition-all">
                  Compare Other Hospitals <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <ShieldCheck className="w-64 h-64" />
              </div>
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
