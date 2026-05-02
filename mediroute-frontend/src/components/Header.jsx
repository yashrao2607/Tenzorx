import { ActivitySquare, User, Building2 } from 'lucide-react';

const Header = ({ step, viewMode, setViewMode }) => {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon-wrap">
          <ActivitySquare color="#00d2ff" size={32} />
        </div>
        <span>MediRoute<span className="gradient-text">.AI</span></span>
      </div>

      <div className="view-toggle glass-panel">
        <button 
          className={`toggle-btn ${viewMode === 'patient' ? 'active' : ''}`}
          onClick={() => setViewMode('patient')}
        >
          <User size={16} /> Patient
        </button>
        <button 
          className={`toggle-btn ${viewMode === 'lender' ? 'active' : ''}`}
          onClick={() => setViewMode('lender')}
        >
          <Building2 size={16} /> Lender
        </button>
      </div>

      <div className="step-indicator">
        <div className={`step-dot ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`} />
        <div className={`step-dot ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`} />
        <div className={`step-dot ${step === 3 ? 'active' : ''}`} />
      </div>
    </header>
  );
};

export default Header;
