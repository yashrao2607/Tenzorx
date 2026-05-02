import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CreditCard, Briefcase, MapPin, Phone } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

const onlyDigits = (value) => value.replace(/\D/g, '');
const normalizePan = (value) => value.replace(/[^a-z0-9]/gi, '').toUpperCase();

const Verhoeff = {
  d: [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ],
  p: [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  ],
  validate: (number) => {
    if (!/^\d{12}$/.test(number)) return false;
    if (number[0] === '0' || number[0] === '1') return false;
    let c = 0;
    const digits = number.split('').reverse().map(Number);
    for (let i = 0; i < digits.length; i++) c = Verhoeff.d[c][Verhoeff.p[i % 8][digits[i]]];
    return c === 0;
  }
};

const RegistrationForm = ({ onRegister, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '', age: '', gender: 'Male', aadhaar: '', pan: '', occupation: 'Salaried', city: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData, age: Number(formData.age),
      gender: formData.gender,
      aadhaar: onlyDigits(formData.aadhaar),
      pan: normalizePan(formData.pan),
      phone: onlyDigits(formData.phone),
      city: formData.city.trim(),
      name: formData.name.trim(),
    };

    if (!Verhoeff.validate(payload.aadhaar)) { setError('Invalid Aadhaar number.'); setLoading(false); return; }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(payload.pan)) { setError('Invalid PAN format.'); setLoading(false); return; }
    if (payload.phone.length !== 10 || !/^[6-9]/.test(payload.phone)) { setError('Invalid phone number.'); setLoading(false); return; }
    if (!payload.city) { setError('Please select your city.'); setLoading(false); return; }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/register-user`, payload);
      onRegister({ ...payload, ...response.data });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto glass-card p-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-secondary rounded-2xl">
          <UserPlus className="text-primary w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{initialData ? 'Edit Profile' : 'Create Patient Profile'}</h2>
          <p className="text-slate-500 font-medium">Please provide accurate details for clinical underwriting.</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
            <input required className="input-field w-full" placeholder="Ex: Rahul Sharma" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 ml-1">Age</label>
            <input required type="number" className="input-field w-full" placeholder="25" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 ml-1">Gender</label>
            <select className="input-field w-full appearance-none" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Aadhaar Number
            </label>
            <input required maxLength={12} className="input-field w-full" placeholder="12-digit UID" value={formData.aadhaar} onChange={(e) => setFormData({ ...formData, aadhaar: onlyDigits(e.target.value).slice(0, 12) })} />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> PAN Number
            </label>
            <input required maxLength={10} className="input-field w-full" placeholder="ABCDE1234F" value={formData.pan} onChange={(e) => setFormData({ ...formData, pan: normalizePan(e.target.value).slice(0, 10) })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Occupation
            </label>
            <select className="input-field w-full appearance-none" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}>
              {['Salaried', 'Self-Employed', 'Student', 'Retired', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Mobile Number
            </label>
            <input required maxLength={10} className="input-field w-full" placeholder="10-digit Mobile" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: onlyDigits(e.target.value).slice(0, 10) })} />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-600 ml-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Preferred City
          </label>
          <select required className="input-field w-full appearance-none" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
            <option value="">Select Location</option>
            {['Nagpur', 'Mumbai', 'Pune', 'Delhi', 'Bangalore'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button disabled={loading} type="submit" className="btn-primary w-full py-4 text-lg">
          {loading ? 'Processing...' : (initialData ? 'Update Details' : 'Create Profile & Continue')}
        </button>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
