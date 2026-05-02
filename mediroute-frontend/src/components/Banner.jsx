import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

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
        <div className='relative my-32 px-4'>
            <div className='glass-card flex flex-col md:flex-row items-center bg-primary/95 border-primary/20 overflow-visible relative'>
                {/* ------- Left Side ------- */}
                <div className='flex-1 p-8 sm:p-12 md:p-16 lg:p-20 space-y-6 z-10'>
                    <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider'>
                        <ShieldCheck className='w-4 h-4' /> Verified Clinical Intelligence
                    </div>
                    <div className='text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight'>
                        <p>Audit Medical Costs</p>
                        <p className='opacity-80'>With Institutional AI</p>
                    </div>
                    <p className='text-white/70 text-base sm:text-lg font-medium max-w-md'>
                        Protect your financial health with our regional cost auditing and instant clinical underwriting engine.
                    </p>
                    <button onClick={handleAction} className='bg-white text-primary font-extrabold px-8 sm:px-10 py-3 sm:py-4 rounded-2xl shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 active:scale-95'>
                        Start Clinical Intake
                    </button>
                </div>

                {/* ------- Right Side ------- */}
                <div className='md:w-1/2 lg:w-[480px] relative h-[300px] sm:h-[400px] lg:h-[500px] flex items-end justify-end overflow-hidden md:overflow-visible w-full'>
                    <motion.img 
                        initial={{ opacity: 0, scale: 1.1 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className='w-full max-w-[400px] md:max-w-none md:absolute bottom-0 right-0 z-20' 
                        src={assets.appointment_img} 
                        alt="Clinical Audit" 
                    />
                    <div className='absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-primary/50 to-transparent z-10'></div>
                </div>
            </div>
        </div>
    )
}

export default Banner