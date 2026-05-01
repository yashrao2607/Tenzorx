import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingDown, Users, FileText, AlertCircle } from 'lucide-react';
import GlassCard from './GlassCard';

const LenderDashboard = () => {
  const stats = [
    { label: 'Total Exposure', value: '₹4.2 Cr', trend: '-12%', icon: <FileText size={20} /> },
    { label: 'NPA Risk Buffer', value: '7.2%', trend: '-2.4%', icon: <TrendingDown size={20} /> },
    { label: 'Active Patients', value: '1,284', trend: '+18%', icon: <Users size={20} /> },
    { label: 'Fraud Alerts', value: '3', trend: 'Critical', icon: <ShieldAlert size={20} color="#ef4444" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="lender-dashboard"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <GlassCard key={i} className="stat-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div className="logo-icon-wrap" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)' }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: stat.trend.includes('-') ? 'var(--success-color)' : stat.trend === 'Critical' ? 'var(--danger-color)' : 'var(--primary-color)' }}>
                {stat.trend}
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="main-content split">
        <GlassCard style={{ padding: '24px' }}>
          <h3 className="form-label" style={{ marginBottom: '20px' }}>Anomalous Claims Queue</h3>
          <div className="claims-list">
            {[1, 2, 3].map((item) => (
              <div key={item} className="claim-item glass-panel" style={{ padding: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Claim #MR-290{item}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Nagpur Care Hospital • Cardiology</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--danger-color)' }}>+24% Over Benchmark</div>
                  <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    <AlertCircle size={12} /> Comorbidity Mismatch
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '24px' }}>
          <h3 className="form-label" style={{ marginBottom: '20px' }}>Clinical Risk Dispersion</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '20px' }}>
            {[40, 70, 45, 90, 65, 80].map((h, i) => (
              <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, var(--primary-color), var(--secondary-color))', height: `${h}%`, borderRadius: '4px', opacity: 0.7 }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)' }}>
            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default LenderDashboard;
