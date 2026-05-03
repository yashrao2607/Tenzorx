import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ArrowUpDown,
  Building2,
  Calendar,
  IndianRupee,
  Activity
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

const LenderDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/lender/audit-logs`);
      setLogs(response.data.logs || []);
    } catch (err) {
      setError('Failed to fetch audit records.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (decision) => {
    switch (decision) {
      case 'APPROVED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'REVIEW': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'REJECTED': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-rose-500';
  };

  const stats = {
    total: logs.length,
    avgFairness: logs.length > 0 ? (logs.reduce((acc, l) => acc + (l.fairness_score || 0), 0) / logs.length).toFixed(0) : 0,
    approvalRate: logs.length > 0 ? ((logs.filter(l => l.decision === 'APPROVED').length / logs.length) * 100).toFixed(0) : 0
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary rounded-lg text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Lender Audit Portal</h1>
            </div>
            <p className="text-slate-500">Professional transparency engine for institutional medical underwriting.</p>
          </div>
          
          <button 
            onClick={fetchLogs}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" /> Refresh Audit Trail
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Audits', val: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Avg Fairness Score', val: `${stats.avgFairness}%`, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Institutional Approval', val: `${stats.approvalRate}%`, icon: CheckCircle2, color: 'text-primary', bg: 'bg-secondary' }
          ].map((s, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6"
            >
              <div className={`p-4 rounded-2xl ${s.bg} ${s.color}`}>
                <s.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl font-black text-slate-900">{s.val}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Audit List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-primary" /> Recent Loan Decisions
            </h3>
            
            {loading ? (
              <div className="p-20 text-center bg-white rounded-3xl border border-slate-100">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Loading audit logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 italic text-slate-400">
                No loan records found in the audit trail.
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient / ID</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedure</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fairness</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Decision</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {logs.map((log, idx) => (
                        <motion.tr 
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setSelectedLog(log)}
                          className={`cursor-pointer transition-all hover:bg-slate-50 group ${selectedLog === log ? 'bg-secondary/30' : ''}`}
                        >
                          <td className="p-6">
                            <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{log.patient_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">{log.user_id}</div>
                          </td>
                          <td className="p-6">
                            <div className="font-medium text-slate-700">{log.procedure}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{log.city} • {log.icd10_code}</div>
                          </td>
                          <td className="p-6 text-center">
                            <div className={`text-xl font-black ${getScoreColor(log.fairness_score)}`}>
                              {log.fairness_score || 0}
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border tracking-widest ${getStatusColor(log.decision)}`}>
                              {log.decision}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="font-black text-slate-900">₹{log.requested_amount?.toLocaleString()}</div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Details Pane */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-primary" /> Audit Detail
            </h3>
            
            <AnimatePresence mode="wait">
              {selectedLog ? (
                <motion.div 
                  key={selectedLog.timestamp}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden"
                >
                  <div className="p-8 space-y-8">
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{selectedLog.hospital_name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> {new Date(selectedLog.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
                          <p className="text-2xl font-black text-slate-900">₹{selectedLog.requested_amount?.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Market Fair Price</p>
                          <p className="text-lg font-bold text-primary">₹{selectedLog.fair_market_price?.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (selectedLog.fair_market_price / selectedLog.requested_amount) * 100)}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Justification</h5>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{selectedLog.recommendation}"
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">ABDM Verified History used</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Overpricing</p>
                        <p className={`text-lg font-black ${selectedLog.overpricing_pct > 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {selectedLog.overpricing_pct}%
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Audit Score</p>
                        <p className={`text-lg font-black ${getScoreColor(selectedLog.fairness_score)}`}>
                          {selectedLog.fairness_score}/100
                        </p>
                      </div>
                    </div>

                    {selectedLog.decision === 'REJECTED' && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                        <p className="text-[11px] text-rose-700 font-medium">
                          High inflation risk detected. This application violates regional market fairness standards.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="p-10 text-center bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center gap-4">
                  <div className="p-4 bg-white rounded-full shadow-sm text-slate-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <p className="text-slate-400 font-medium text-sm">Select an application to view full audit trail.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LenderDashboard;
