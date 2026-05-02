import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CreditCard, Briefcase, MapPin, Phone } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

const onlyDigits = (value) => value.replace(/\D/g, '');
const normalizePan = (value) => value.replace(/[^a-z0-9]/gi, '').toUpperCase();

// Verhoeff Algorithm for Aadhaar Validation
const Verhoeff = {
  d: [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ],
  p: [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  ],
  validate: (number) => {
    if (!/^\d{12}$/.test(number)) return false;
    if (number[0] === '0' || number[0] === '1') return false;
    let c = 0;
    const digits = number.split('').reverse().map(Number);
    for (let i = 0; i < digits.length; i++) {
      c = Verhoeff.d[c][Verhoeff.p[i % 8][digits[i]]];
    }
    return c === 0;
  }
};

const RegistrationForm = ({ onRegister, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
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

    const payload = {
      ...formData,
      age: Number(formData.age),
      aadhaar: onlyDigits(formData.aadhaar),
      pan: normalizePan(formData.pan),
      phone: onlyDigits(formData.phone),
      city: formData.city.trim(),
      name: formData.name.trim(),
    };

    if (!payload.name) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }
    if (!Number.isInteger(payload.age) || payload.age < 1 || payload.age > 120) {
      setError('Please enter a valid age.');
      setLoading(false);
      return;
    }
    if (!Verhoeff.validate(payload.aadhaar)) {
      setError('Invalid Aadhaar number. It must be 12 digits, pass checksum, and not start with 0 or 1.');
      setLoading(false);
      return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(payload.pan)) {
      setError('Invalid PAN format. Must use ABCDE1234F format.');
      setLoading(false);
      return;
    }
    if (payload.phone.length !== 10 || !/^[6-9]/.test(payload.phone)) {
      setError('Invalid mobile number. Must be 10 digits starting with 6-9.');
      setLoading(false);
      return;
    }
    if (!payload.city) {
      setError('Please select your current city.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/register-user`, payload);
      onRegister({ ...payload, ...response.data });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please check the fields and try again.');
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
          <h2 className="text-2xl font-bold">{initialData ? 'Update Profile' : 'Patient Registration'}</h2>
          <p className="text-slate-400">{initialData ? 'Modify your details for more accurate underwriting.' : 'Enter your KYC details to access medical transparency services.'}</p>
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
              onChange={(e) => setFormData({ ...formData, aadhaar: onlyDigits(e.target.value).slice(0, 12) })}
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
              onChange={(e) => setFormData({ ...formData, pan: normalizePan(e.target.value).slice(0, 10) })}
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
              onChange={(e) => setFormData({ ...formData, phone: onlyDigits(e.target.value).slice(0, 10) })}
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
          {loading ? (initialData ? 'Updating...' : 'Registering...') : (initialData ? 'Save Changes' : 'Register & Continue')}
        </button>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
