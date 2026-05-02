import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

const Header = () => {
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
        <div className='relative mt-6 mb-20'>
            {/* Background Glow */}
            <div className='absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]'></div>
            <div className='absolute top-40 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]'></div>

            <div className='glass-card flex flex-col md:flex-row items-center overflow-hidden'>
                {/* --------- Header Left --------- */}
                <div className='md:w-1/2 lg:w-3/5 flex flex-col items-start justify-center gap-6 p-8 md:p-16 lg:p-20 z-10'>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-wider'
                    >
                        <Sparkles className='w-3 h-3' /> Next-Generation Medical AI
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight'
                    >
                        Institutional <span className='text-primary'>Clinical</span> Intelligence
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='text-slate-500 text-base md:text-lg lg:text-xl font-medium max-w-xl'
                    >
                        Experience multi-turn AI diagnostics, precise regional cost auditing, and seamless medical loan underwriting in a single unified portal.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className='flex flex-wrap items-center gap-4'
                    >
                        <button onClick={handleAction} className='btn-primary flex items-center gap-3 group whitespace-nowrap'>
                            Analyze Symptoms <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                        </button>
                        <div className='flex items-center gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-100'>
                            <img className='w-20 sm:w-24' src={assets.group_profiles} alt="" />
                            <p className='text-[10px] font-bold text-slate-400 uppercase leading-none hidden sm:block'>Trusted by <br /><span className='text-slate-600'>12,000+ Patients</span></p>
                        </div>
                    </motion.div>
                </div>

                {/* --------- Header Right --------- */}
                <div className='md:w-1/2 lg:w-2/5 relative flex items-end justify-center min-h-[350px] md:min-h-[500px] w-full'>
                    <motion.img 
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className='w-full h-full object-contain object-bottom' 
                        src={assets.header_img} 
                        alt="Clinical Intelligence" 
                    />
                    <div className='absolute bottom-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10'></div>
                </div>
            </div>
        </div>
    )
}

export default Header