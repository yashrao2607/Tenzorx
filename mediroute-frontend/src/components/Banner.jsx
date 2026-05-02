import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Banner = () => {

    const navigate = useNavigate()
    const { token } = useContext(AppContext)

    const handleAction = () => {
        if (token) {
            navigate('/mediroute')
        } else {
            navigate('/login')
        }
        scrollTo(0, 0)
    }

    return (
        <div className='flex bg-primary rounded-lg  px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>

            {/* ------- Left Side ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    <p>Audit Medical Costs</p>
                    <p className='mt-4'>With Institutional-Grade AI</p>
                </div>
                <button onClick={handleAction} className='bg-white text-sm sm:text-base text-primary font-bold px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Start Clinical Intake</button>
            </div>

            {/* ------- Right Side ------- */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
            </div>
        </div>
    )
}

export default Banner