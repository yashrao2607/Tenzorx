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
    <div className='min-h-screen flex items-center justify-center py-12 px-4'>
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmitHandler} 
        className='w-full max-w-[900px] flex flex-col md:flex-row glass-card overflow-hidden shadow-2xl backdrop-blur-3xl'
      >
        {/* Left Side - Visual Branding */}
        <div className='md:w-[350px] bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden'>
          <div className='relative z-10 space-y-4'>
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Shield className="w-8 h-8 text-white fill-current" />
            </div>
            <h2 className='text-3xl font-black tracking-tight leading-tight uppercase'>
              MediRoute <br /> <span className='opacity-60'>Institutional</span>
            </h2>
          </div>
          
          <div className='relative z-10 space-y-6'>
            <p className='text-white/80 font-medium'>
              "The most advanced clinical intelligence portal for cost auditing and medical diagnostics."
            </p>
            <div className='flex -space-x-2'>
              {[1,2,3,4].map(i => (
                <div key={i} className='w-8 h-8 rounded-full border-2 border-primary bg-slate-200' />
              ))}
              <div className='w-8 h-8 rounded-full border-2 border-primary bg-primary-light flex items-center justify-center text-[10px] text-primary font-bold'>+2k</div>
            </div>
          </div>

          {/* Abstract Shapes */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2' />
        </div>

        {/* Right Side - Form */}
        <div className='flex-1 p-8 md:p-12 space-y-8 bg-white/50'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
              {state === 'Sign Up' ? "Create Account" : "Welcome Back"}
            </h1>
            <p className='text-slate-500 font-medium'>
              {state === 'Sign Up' ? "Institutional Registration Protocol" : "Secure Clinical Portal Access"}
            </p>
          </div>

          <div className={`${state === 'Sign Up' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-5'} w-full`}>
            {state === 'Sign Up' && (
              <>
                <div className='md:col-span-2 space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Full Name</label>
                  <div className='relative group'>
                    <User className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setName(e.target.value)} value={name} className='input-field w-full pl-12 py-3.5 bg-white/60' type="text" placeholder="John Doe" required />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Age</label>
                  <div className='relative group'>
                    <UserCircle className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setAge(e.target.value)} value={age} className='input-field w-full pl-12 py-3.5 bg-white/60' type="number" placeholder="25" required />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Employment</label>
                  <div className='relative group'>
                    <Briefcase className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <select onChange={(e) => setEmploymentType(e.target.value)} value={employmentType} className='input-field w-full pl-12 py-3.5 bg-white/60 appearance-none'>
                      <option value="Salaried">Salaried</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Gender</label>
                  <div className='relative group'>
                    <UserCircle className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <select onChange={(e) => setGender(e.target.value)} value={gender} className='input-field w-full pl-12 py-3.5 bg-white/60 appearance-none'>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>City</label>
                  <div className='relative group'>
                    <MapPin className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setCity(e.target.value)} value={city} className='input-field w-full pl-12 py-3.5 bg-white/60' type="text" placeholder="Mumbai" required />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Phone</label>
                  <div className='relative group'>
                    <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} className='input-field w-full pl-12 py-3.5 bg-white/60' type="tel" placeholder="9876543210" required />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>PAN Card</label>
                  <div className='relative group'>
                    <IdCard className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setPanCard(e.target.value)} value={panCard} className='input-field w-full pl-12 py-3.5 bg-white/60 uppercase' type="text" placeholder="ABCDE1234F" required />
                  </div>
                </div>

                <div className='md:col-span-2 space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Aadhaar Number</label>
                  <div className='relative group'>
                    <IdCard className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setAadharCard(e.target.value)} value={aadharCard} className='input-field w-full pl-12 py-3.5 bg-white/60' type="text" placeholder="1234 5678 9012" required />
                  </div>
                </div>
              </>
            )}

            {state === 'Login' && (
              <>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Institutional ID</label>
                  <div className='relative group'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='input-field w-full pl-12 py-4 bg-white/60' type="text" placeholder="USR-d65781ec" required />
                  </div>
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Password</label>
                  <div className='relative group'>
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors' />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='input-field w-full pl-12 py-4 bg-white/60' type="password" placeholder="••••••••" required />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className='space-y-6 pt-4'>
            <button className='btn-primary w-full py-4 text-sm tracking-widest uppercase'>
              {state === 'Sign Up' ? 'Initialize Institutional Account' : 'Authenticate Session'}
            </button>
            
            <p className='text-center text-slate-500 font-medium'>
              {state === 'Sign Up' ? "Already registered?" : "New to the network?"} 
              <button 
                type='button'
                onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')} 
                className='ml-2 text-primary font-bold hover:underline underline-offset-4'
              >
                {state === 'Sign Up' ? "Sign In" : "Initialize Identity"}
              </button>
            </p>
          </div>
        </div>
      </motion.form>
    </div>
  )
}

export default Login