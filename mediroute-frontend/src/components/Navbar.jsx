import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Shield, User, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'

const Navbar = () => {

  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='sticky top-4 z-[100] px-4 md:px-0'>
      <div className='flex items-center justify-between py-2 px-8 glass-card mx-auto max-w-7xl backdrop-blur-3xl'>
        
        {/* Logo */}
        <div onClick={() => navigate('/')} className='flex items-center gap-3 cursor-pointer group'>
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
            <Shield className="w-6 h-6 text-white fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
            MediRoute <span className="text-primary">AI</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <ul className='hidden lg:flex items-center gap-8 font-bold text-slate-500 text-[11px] tracking-[0.15em]'>
          <NavLink to='/' className={({isActive}) => isActive ? 'text-primary' : 'hover:text-slate-900 transition-colors'}>
            <li className='py-1'>HOME</li>
          </NavLink>
          <NavLink to='/doctors' className={({isActive}) => isActive ? 'text-primary' : 'hover:text-slate-900 transition-colors'}>
            <li className='py-1'>NETWORK</li>
          </NavLink>
          <NavLink to='/mediroute' className={({isActive}) => isActive ? 'text-primary' : 'hover:text-slate-900 transition-colors'}>
            <li className='py-1'>MEDIROUTE AI</li>
          </NavLink>
          <NavLink to='/about' className={({isActive}) => isActive ? 'text-primary' : 'hover:text-slate-900 transition-colors'}>
            <li className='py-1'>ABOUT</li>
          </NavLink>
          <NavLink to='/lender' className={({isActive}) => isActive ? 'text-primary' : 'hover:text-slate-900 transition-colors'}>
            <li className='py-1'>LENDER</li>
          </NavLink>
        </ul>

        {/* Action Area */}
        <div className='flex items-center gap-4'>
          {token && userData ? (
            <div className='flex items-center gap-3 cursor-pointer group relative py-2'>
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform uppercase">
                {userData.name.charAt(0)}
              </div>
              
              {/* Dropdown Menu */}
              <div className='absolute top-full right-0 pt-2 hidden group-hover:block z-[200]'>
                <div className='min-w-[240px] glass-card p-3 shadow-2xl border-white/60 backdrop-blur-3xl'>
                  <div className="px-3 py-4 mb-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Institution</p>
                    <p className="text-slate-900 font-bold truncate">{userData.name}</p>
                  </div>
                  <button onClick={() => navigate('/my-profile')} className='w-full flex items-center gap-3 hover:bg-primary/10 p-3 rounded-xl transition-all text-slate-600 hover:text-primary font-bold text-sm'>
                    <User className="w-4 h-4" /> Profile Identity
                  </button>
                  <button onClick={() => navigate('/my-appointments')} className='w-full flex items-center gap-3 hover:bg-primary/10 p-3 rounded-xl transition-all text-slate-600 hover:text-primary font-bold text-sm'>
                    <LayoutDashboard className="w-4 h-4" /> Clinical Diagnostics
                  </button>
                  <hr className="my-2 border-slate-100" />
                  <button onClick={logout} className='w-full flex items-center gap-3 hover:bg-rose-50 p-3 rounded-xl transition-all text-rose-600 font-bold text-sm'>
                    <LogOut className="w-4 h-4" /> Terminate Session
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className='btn-primary px-8 py-3.5 text-xs tracking-widest hidden md:block'>
              CREATE PROFILE
            </button>
          )}

          <button onClick={() => setShowMenu(true)} className='lg:hidden p-2 bg-slate-100 rounded-xl'>
            <Menu className='w-6 h-6 text-slate-700' />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${showMenu ? 'visible opacity-100' : 'invisible opacity-0'}`}>
          <div className='absolute inset-0 bg-slate-900/60 backdrop-blur-md' onClick={() => setShowMenu(false)}></div>
          <div className={`absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl transition-transform duration-500 transform ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className='flex items-center justify-between p-8 border-b'>
              <span className="text-xl font-black text-slate-900 uppercase">Menu</span>
              <X onClick={() => setShowMenu(false)} className='w-8 h-8 text-slate-400 cursor-pointer' />
            </div>
            <div className='p-8 flex flex-col gap-6 text-xl font-bold text-slate-900'>
              <NavLink onClick={() => setShowMenu(false)} to='/'>HOME</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctors'>NETWORK</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/mediroute'>MEDIROUTE AI</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about'>ABOUT</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/lender'>LENDER</NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/contact'>CONTACT</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar