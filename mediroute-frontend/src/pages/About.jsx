import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { ShieldCheck, Target, Zap, HeartPulse, BrainCircuit, Wallet } from 'lucide-react'

const About = () => {
  return (
    <div className='py-12 space-y-32'>
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center space-y-6'
      >
        <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-widest'>
          <ShieldCheck className='w-4 h-4' /> Institutional Excellence
        </div>
        <h1 className='text-4xl md:text-6xl font-black text-slate-900 tracking-tight'>
          About <span className='text-primary'>MediRoute AI</span>
        </h1>
        <p className='max-w-2xl mx-auto text-slate-500 font-medium text-lg leading-relaxed'>
          Pioneering the future of clinical intelligence and medical financial forensics.
        </p>
      </motion.div>

      {/* Main Content Section */}
      <div className='flex flex-col lg:flex-row gap-16 items-center'>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className='lg:w-1/2 relative'
        >
          <div className='absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30'></div>
          <img 
            className='w-full rounded-[2.5rem] shadow-2xl relative z-10' 
            src={assets.about_image} 
            alt="MediRoute AI Mission" 
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80"
            }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className='lg:w-1/2 space-y-8'
        >
          <div className='space-y-6 text-slate-600 text-lg leading-relaxed'>
            <p className='font-bold text-slate-900 text-2xl'>
              Institutional intelligence for modern healthcare navigation.
            </p>
            <p>
              Welcome to <span className="font-bold text-primary">MediRoute AI</span>, your institutional partner in navigating the complexities of modern healthcare. We empower patients and providers with AI-driven diagnostic insights, regional cost auditing, and seamless medical financial bridges.
            </p>
            <p>
              Our platform leverages high-fidelity AI models to provide multi-turn diagnostic analysis, ensuring every medical journey is backed by data-driven precision. We bridge the gap between clinical needs and financial feasibility.
            </p>
          </div>

          <div className='glass-panel p-8 space-y-4 border-primary/10'>
            <div className='flex items-center gap-3 text-primary'>
              <Target className='w-6 h-6' />
              <b className='text-slate-900 text-xl font-bold'>Our Vision</b>
            </div>
            <p className='text-slate-600 font-medium leading-relaxed'>
              To eliminate healthcare uncertainty. By providing instant cost transparency and underwriting clinical loans through institutional partnerships, we ensure that no patient ever has to choose between their health and their financial stability.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className='space-y-16'>
        <div className='text-center space-y-4'>
          <h2 className='text-3xl md:text-4xl font-black text-slate-900'>Why Choose <span className='text-primary'>MediRoute</span></h2>
          <p className='text-slate-500 font-medium'>The three pillars of our clinical intelligence engine.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pb-20'>
          {[
            {
              title: "PRECISION",
              desc: "AI-driven clinical intake and multi-turn analysis for high-fidelity diagnostic pathways.",
              icon: BrainCircuit,
              color: "text-blue-500",
              bg: "bg-blue-50"
            },
            {
              title: "TRANSPARENCY",
              desc: "Regional cost auditing providing real-world price benchmarks across institutional facilities.",
              icon: Zap,
              color: "text-amber-500",
              bg: "bg-amber-50"
            },
            {
              title: "ACCESSIBILITY",
              desc: "Instant medical loan underwriting to bridge the gap between diagnosis and treatment.",
              icon: Wallet,
              color: "text-emerald-500",
              bg: "bg-emerald-50"
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className='glass-card p-10 space-y-6 group cursor-default'
            >
              <div className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12`}>
                <item.icon className='w-8 h-8' />
              </div>
              <h3 className='text-xl font-black text-slate-900 tracking-tight'>{item.title}</h3>
              <p className='text-slate-500 font-medium leading-relaxed'>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default About
