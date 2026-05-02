import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, User, Mail, Lock, Phone, MapPin, Briefcase, IdCard, UserCircle } from 'lucide-react'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [panCard, setPanCard] = useState('')
  const [aadharCard, setAadharCard] = useState('')
  const [employmentType, setEmploymentType] = useState('Salaried')
  const [city, setCity] = useState('')
  const [selectedState, setSelectedState] = useState('Maharashtra')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('Male')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Sign Up') {
        const payload = {
          name,
          age: parseInt(age),
          gender,
          aadhaar: aadharCard,
          pan: panCard,
          occupation: employmentType,
          city,
          state: selectedState,
          phone
        }

        const { data } = await axios.post(backendUrl + '/api/register-user', payload)

        if (data.user_id) {
          localStorage.setItem('token', data.user_id)
          setToken(data.user_id)
          toast.success("Institutional Account Created Successfully")
        } else {
          toast.error(data.message || "Registration Failed")
        }

      } else {
        if (!email.startsWith('USR-')) {
          toast.error("Please enter a valid Institutional ID (starting with USR-)")
          return
        }

        try {
          const { data } = await axios.get(backendUrl + '/api/get-user-profile/' + email)
          if (data.success) {
            localStorage.setItem('token', email)
            setToken(email)
            toast.success("Welcome back to MediRoute AI")
          }
        } catch (error) {
          toast.error("Invalid Institutional ID. Please Sign Up if you don't have one.")
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.detail || "Connection Error: Backend unreachable")
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 bg-[#fcfdfe]'>
      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={onSubmitHandler} 
        className='w-full max-w-[1000px] flex flex-col md:flex-row glass-card overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border-white/80'
      >
        {/* Left Side - Visual Branding */}
        <div className='md:w-[380px] bg-gradient-to-br from-primary via-[#4F5FEF] to-[#3B4ADF] p-12 text-white flex flex-col justify-between relative overflow-hidden'>
          <div className='relative z-10 space-y-6'>
            <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl">
              <Shield className="w-8 h-8 text-white fill-current" />
            </div>
            <div className='space-y-1'>
              <h2 className='text-3xl font-black tracking-tighter leading-none uppercase'>
                MediRoute
              </h2>
              <p className='text-xl font-bold opacity-70 tracking-[0.2em] uppercase'>Institutional</p>
            </div>
          </div>
          
          <div className='relative z-10 space-y-8'>
            <p className='text-white/90 font-medium text-lg leading-relaxed italic'>
              "The most advanced clinical intelligence portal for cost auditing and medical diagnostics."
            </p>
            <div className='flex items-center gap-4'>
              <div className='flex -space-x-3'>
                {[1,2,3,4].map(i => (
                  <div key={i} className='w-10 h-10 rounded-full border-2 border-primary bg-white/20 backdrop-blur-md' />
                ))}
              </div>
              <p className='text-sm font-bold text-white/80'>Trusted by 2,000+ Providers</p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className='absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl' />
          <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl' />
        </div>

        {/* Right Side - Form */}
        <div className='flex-1 p-10 md:p-14 space-y-8 bg-white/40 backdrop-blur-xl'>
          <div className='space-y-2'>
            <h1 className='text-4xl font-black text-slate-900 tracking-tight'>
              {state === 'Sign Up' ? "Create Account" : "Welcome Back"}
            </h1>
            <p className='text-slate-500 font-semibold text-sm uppercase tracking-widest'>
              {state === 'Sign Up' ? "Institutional Registration Protocol" : "Secure Clinical Portal Access"}
            </p>
          </div>

          <div className={`${state === 'Sign Up' ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5' : 'space-y-5'} w-full`}>
            {state === 'Sign Up' && (
              <>
                <div className='md:col-span-2 space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>Full Name</label>
                  <div className='relative group'>
                    <User className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setName(e.target.value)} value={name} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60' type="text" placeholder="John Doe" required />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>Age</label>
                  <div className='relative group'>
                    <UserCircle className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setAge(e.target.value)} value={age} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60' type="number" placeholder="25" required />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>Employment</label>
                  <div className='relative group'>
                    <Briefcase className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <select onChange={(e) => setEmploymentType(e.target.value)} value={employmentType} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60 appearance-none cursor-pointer'>
                      <option value="Salaried">Salaried</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>Gender</label>
                  <div className='relative group'>
                    <UserCircle className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <select onChange={(e) => setGender(e.target.value)} value={gender} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60 appearance-none cursor-pointer'>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>State</label>
                  <div className='relative group'>
                    <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <select onChange={(e) => setSelectedState(e.target.value)} value={selectedState} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60 appearance-none cursor-pointer'>
                      {["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana", "Gujarat", "West Bengal", "Uttar Pradesh", "Kerala", "Punjab", "Rajasthan", "Madhya Pradesh", "Andhra Pradesh", "Haryana", "Bihar", "Odisha", "Assam", "Goa", "Chandigarh", "Jammu and Kashmir"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>City</label>
                  <div className='relative group'>
                    <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setCity(e.target.value)} value={city} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60' type="text" placeholder="Mumbai" required />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>Phone</label>
                  <div className='relative group'>
                    <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60' type="tel" placeholder="9876543210" required />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>PAN Card</label>
                  <div className='relative group'>
                    <IdCard className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setPanCard(e.target.value)} value={panCard} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60 uppercase' type="text" placeholder="ABCDE1234F" required />
                  </div>
                </div>

                <div className='md:col-span-2 space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>Aadhaar Number</label>
                  <div className='relative group'>
                    <IdCard className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setAadharCard(e.target.value)} value={aadharCard} className='input-field w-full pl-12 py-3 bg-white/80 border-slate-200/60' type="text" placeholder="1234 5678 9012" required />
                  </div>
                </div>
              </>
            )}

            {state === 'Login' && (
              <>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>Institutional ID</label>
                  <div className='relative group'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='input-field w-full pl-12 py-4 bg-white/80 border-slate-200/60' type="text" placeholder="USR-d65781ec" required />
                  </div>
                </div>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1'>Password</label>
                  <div className='relative group'>
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='input-field w-full pl-12 py-4 bg-white/80 border-slate-200/60' type="password" placeholder="••••••••" required />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className='space-y-6 pt-6'>
            <button className='btn-primary w-full py-4 text-xs font-black tracking-[0.2em] uppercase shadow-2xl shadow-primary/40'>
              {state === 'Sign Up' ? 'Initialize Account' : 'Authenticate Session'}
            </button>
            
            <p className='text-center text-slate-400 font-bold text-sm'>
              {state === 'Sign Up' ? "ALREADY REGISTERED?" : "NEW TO THE NETWORK?"} 
              <button 
                type='button'
                onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')} 
                className='ml-2 text-primary hover:text-primary/80 transition-colors underline underline-offset-8'
              >
                {state === 'Sign Up' ? "SIGN IN" : "INITIALIZE IDENTITY"}
              </button>
            </p>
          </div>
        </div>
      </motion.form>
    </div>
  )
}

export default Login