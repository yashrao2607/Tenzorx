import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Hospitals from './pages/Hospitals'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Verify from './pages/Verify'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContextProvider from './context/AppContext'
import MediRouteFlow from './MediRouteFlow'
import LenderDashboard from './pages/LenderDashboard'

const App = () => {
  return (
    <AppContextProvider>
      <div className='mx-4 sm:mx-[10%] max-w-[1440px] xl:mx-auto'>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/mediroute' element={<MediRouteFlow />} />
          <Route path='/lender' element={<LenderDashboard />} />
          <Route path='/doctors' element={<Hospitals />} />
          <Route path='/doctors/:speciality' element={<Hospitals />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
        <Footer />
      </div>
    </AppContextProvider>
  )
}

export default App
