import { motion } from 'framer-motion';
import { Star, Building2, TrendingUp } from 'lucide-react';

const HospitalList = ({ hospitals }) => {
  if (!hospitals) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-teal-400" /> Best Value Providers
      </h3>
      <div className="grid gap-4">
        {hospitals.slice(0, 3).map((hospital, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between hover:border-teal-500/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-teal-500/10 transition-colors">
                <Building2 className="w-5 h-5 text-slate-400 group-hover:text-teal-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-200">{hospital.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-slate-400">{hospital.quality_score} Quality Score</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-teal-400">₹{hospital.cost.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Estimated Cost</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HospitalList;
