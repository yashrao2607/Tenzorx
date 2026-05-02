import { motion } from 'framer-motion';
import { Stethoscope, ShieldCheck, PieChart as PieChartIcon, ArrowRight, Save } from 'lucide-react';
import CostBreakdownChart from './CostBreakdownChart';
import HospitalList from './HospitalList';

const CostDashboard = ({ data, onNext }) => {
  if (!data) return null;

  const { diagnosis, cost_analysis } = data;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 flex items-center gap-6">
          <div className="p-4 bg-teal-500/10 rounded-2xl">
            <Stethoscope className="text-teal-400 w-10 h-10" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-teal-500 font-bold">Clinical Diagnosis</span>
            <h2 className="text-3xl font-bold text-white">{diagnosis.condition}</h2>
            <p className="text-slate-400 mt-1">Recommended Procedure: <span className="text-slate-200">{diagnosis.recommended_procedure}</span></p>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-slate-900 to-teal-900/20 border-teal-500/20">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-teal-400 w-5 h-5" />
            <span className="text-sm font-semibold text-teal-400">Clinical Confidence</span>
          </div>
          <div className="text-4xl font-bold">{(diagnosis.confidence_score * 100).toFixed(0)}%</div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${diagnosis.confidence_score * 100}%` }}
              className="bg-teal-400 h-full"
            />
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Base Cost Estimate</p>
          <p className="text-2xl font-bold">₹{cost_analysis?.base_cost_estimate?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="glass-card p-6 border-teal-500/30">
          <p className="text-teal-400 text-xs mb-1 uppercase tracking-wider">Risk-Adjusted Cost</p>
          <p className="text-2xl font-bold text-teal-400">₹{cost_analysis?.risk_adjusted_cost?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Min Market Price</p>
          <p className="text-2xl font-bold">₹{cost_analysis?.min_cost?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="glass-card p-6 border-blue-500/30">
          <p className="text-blue-400 text-xs mb-1 uppercase tracking-wider flex items-center gap-1">
            <Save className="w-3 h-3" /> Potential Savings
          </p>
          <p className="text-2xl font-bold text-blue-400">₹{cost_analysis?.savings_opportunity?.toLocaleString() || '0'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-teal-400" /> Cost Breakdown
          </h3>
          {cost_analysis?.cost_breakdown ? (
            <CostBreakdownChart data={cost_analysis.cost_breakdown} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 italic">
              No breakdown data available for this procedure.
            </div>
          )}
        </div>
        <div className="glass-card p-8">
          <HospitalList hospitals={cost_analysis?.hospital_options} />
        </div>
      </div>

      <div className="flex justify-center pt-4 pb-12">
        <button 
          onClick={onNext}
          className="btn-primary px-12 py-4 flex items-center gap-3 text-lg"
        >
          View Loan Underwriting <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default CostDashboard;
