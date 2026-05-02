import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CreditCard, Briefcase, MapPin, Phone } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

const RegistrationForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    aadhaar: '',
    pan: '',
    occupation: 'Salaried',
    city: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register-user`, formData);
      onRegister(response.data);
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-500/10 rounded-lg">
          <UserPlus className="text-teal-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Patient Registration</h2>
          <p className="text-slate-400">Enter your KYC details to access medical transparency services.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <input
              required
              className="input-field w-full"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Age</label>
            <input
              required
              type="number"
              className="input-field w-full"
              placeholder="25"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-400" /> Aadhaar Card
            </label>
            <input
              required
              maxLength={12}
              className="input-field w-full"
              placeholder="12-digit number"
              value={formData.aadhaar}
              onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-400" /> PAN Card
            </label>
            <input
              required
              maxLength={10}
              className="input-field w-full"
              placeholder="ABCDE1234F"
              value={formData.pan}
              onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-400" /> Occupation
            </label>
            <select
              className="input-field w-full appearance-none"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            >
              <option value="Salaried">Salaried</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-400" /> Phone Number
            </label>
            <input
              required
              maxLength={10}
              className="input-field w-full"
              placeholder="10-digit number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-400" /> Current City
          </label>
          <select
            required
            className="input-field w-full appearance-none"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          >
            <option value="">Select City</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register & Continue'}
        </button>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
