import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

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
          // For now, since there's no complex auth, we treat user_id as token
          localStorage.setItem('token', data.user_id)
          setToken(data.user_id)
          toast.success("Institutional Account Created Successfully")
        } else {
          toast.error(data.message || "Registration Failed")
        }

      } else {
        // Real User ID login check
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
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center py-10'>
      <div className='flex flex-col gap-6 m-auto items-start p-10 min-w-[340px] sm:min-w-[480px] glass-card backdrop-blur-xl'>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className='text-3xl font-bold text-slate-900'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
            <p className='text-slate-500 font-medium text-sm'>{state === 'Sign Up' ? "Institutional Clinical Identity" : "Access your medical dashboard"}</p>
          </div>
        </div>
        
        {state === 'Sign Up' && (
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='w-full md:col-span-2'>
              <p className='font-medium mb-1'>Full Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="text" placeholder="John Doe" required />
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>Age</p>
              <input onChange={(e) => setAge(e.target.value)} value={age} className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="number" placeholder="25" required />
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>Employment Type</p>
              <select 
                onChange={(e) => setEmploymentType(e.target.value)} 
                value={employmentType} 
                className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white'
              >
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>Gender</p>
              <select 
                onChange={(e) => setGender(e.target.value)} 
                value={gender} 
                className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white'
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>City</p>
              <input onChange={(e) => setCity(e.target.value)} value={city} className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="text" placeholder="Nagpur" required />
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>Phone Number</p>
              <input onChange={(e) => setPhone(e.target.value)} value={phone} className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="tel" placeholder="9876543210" required />
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>PAN Card</p>
              <input onChange={(e) => setPanCard(e.target.value)} value={panCard} className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase' type="text" placeholder="ABCDE1234F" required />
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>Aadhar Card</p>
              <input onChange={(e) => setAadharCard(e.target.value)} value={aadharCard} className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="text" placeholder="1234 5678 9012" required />
            </div>
          </div>
        )}

        {state === 'Login' && (
          <>
            <div className='w-full mt-2'>
              <p className='font-medium mb-1'>Email / User ID</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="text" placeholder="USR-d65781ec" required />
            </div>
            <div className='w-full'>
              <p className='font-medium mb-1'>Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-slate-200 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="password" placeholder="••••••••" required />
            </div>
          </>
        )}
        
        <button className='bg-primary text-white w-full py-3 mt-4 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95'>
          {state === 'Sign Up' ? 'Create Institutional Account' : 'Access Portal'}
        </button>
        
        {state === 'Sign Up'
          ? <p className='w-full text-center mt-2'>Already have an account? <span onClick={() => setState('Login')} className='text-primary font-bold hover:underline cursor-pointer'>Login here</span></p>
          : <p className='w-full text-center mt-2'>Need a new account? <span onClick={() => setState('Sign Up')} className='text-primary font-bold hover:underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login