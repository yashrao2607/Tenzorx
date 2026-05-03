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
        <div className='relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden'>
            {/* Advanced Background System */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10'>
                <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse'></div>
                <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]'></div>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] opacity-[0.03]'></div>
            </div>

            <div className='flex flex-col lg:flex-row items-center gap-16 lg:gap-0'>
                {/* --------- Hero Left --------- */}
                <div className='lg:w-3/5 flex flex-col items-start gap-10 z-10'>
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm shadow-slate-100'
                    >
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Next-Gen Institutional AI</span>
                    </motion.div>
                    
                    <div className="space-y-6">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className='text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-[-0.04em]'
                        >
                            Clinical <br /> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Intelligence</span> <br />
                            Architecture.
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className='text-slate-500 text-lg md:text-xl lg:text-2xl font-medium max-w-2xl leading-relaxed'
                        >
                            Enterprise-grade AI diagnostics, regional cost auditing, and automated gap-funding underwriting in one unified clinical portal.
                        </motion.p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className='flex flex-wrap items-center gap-6'
                    >
                        <button 
                            onClick={handleAction} 
                            className='px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm tracking-widest hover:bg-primary transition-all shadow-2xl shadow-slate-200 flex items-center gap-3 group'
                        >
                            INITIALIZE ANALYSIS <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                        </button>
                        
                        <div className='flex items-center gap-4 group cursor-help'>
                            <div className='flex -space-x-3'>
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className='text-sm font-black text-slate-900'>12.4k+ Records</p>
                                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Verified by ABHA</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --------- Hero Right --------- */}
                <div className='lg:w-2/5 relative flex items-center justify-center w-full'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full"
                    >
                        <img 
                            className='w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)]' 
                            src={assets.header_img} 
                            alt="Clinical Intelligence" 
                        />
                        
                        {/* Floating Intelligence Badges */}
                        <motion.div 
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 -left-10 glass-card p-5 shadow-2xl border-white/60 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">99%</div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Accuracy</p>
                                <p className="text-sm font-bold text-slate-900">Clinical Precision</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute bottom-20 -right-5 glass-card p-5 shadow-2xl border-white/60 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black">₹0</div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Gap</p>
                                <p className="text-sm font-bold text-slate-900">Fair Market Audit</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Header