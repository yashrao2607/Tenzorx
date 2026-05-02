import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Shield } from 'lucide-react'

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
    <div className='flex items-center justify-between text-sm py-4 px-6 mb-5 sticky top-4 z-50 glass-card mx-auto max-w-[95%]'>
      <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer group'>
        <div className="bg-primary p-1.5 rounded-lg">
          <Shield className="w-6 h-6 text-white fill-current" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900">MediRoute <span className="text-primary">AI</span></span>
      </div>
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/' >
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors' >
          <li className='py-1'>ALL HOSPITALS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/mediroute' >
          <li className='py-1'>MEDIROUTE AI</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact' >
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        {
          token
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm uppercase">
                {userData?.name ? userData.name.charAt(0) : "U"}
              </div>
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-white border border-slate-100 shadow-2xl rounded-xl flex flex-col gap-2 p-2'>
                  <p onClick={() => navigate('/my-profile')} className='hover:bg-slate-50 p-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm'>My Clinical Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:bg-slate-50 p-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm'>My Diagnostics</p>
                  <hr className="border-slate-100 mx-2" />
                  <p onClick={logout} className='hover:bg-red-50 hover:text-red-600 p-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm'>Logout Session</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all hidden md:block'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <div className='flex items-center gap-2'>
              <div className="bg-primary p-1 rounded-lg">
                <Shield className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MediRoute <span className="text-primary">AI</span></span>
            </div>
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded full inline-block'>ALL HOSPITALS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/mediroute' ><p className='px-4 py-2 rounded full inline-block'>MEDIROUTE AI</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar