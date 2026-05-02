import React from 'react'
import { Shield, Mail, Phone, MapPin, Code, MessageCircle, Briefcase } from 'lucide-react'

const Footer = () => {
  return (
    <div className='md:mx-10 mt-20 pb-10'>
      <div className='glass-card p-10 md:p-16 flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10'>

        {/* ------- Left Side ------- */}
        <div className='space-y-6'>
            <div className='flex items-center gap-2'>
                <div className="bg-primary p-2 rounded-xl">
                    <Shield className="w-7 h-7 text-white fill-current" />
                </div>
                <span className="text-3xl font-bold tracking-tight text-slate-900">MediRoute <span className="text-primary">AI</span></span>
            </div>
            <p className='w-full md:w-2/3 text-slate-500 leading-relaxed font-medium'>
                Empowering patients with institutional-grade clinical intelligence. Our AI-driven engine provides multi-turn diagnostics, regional cost auditing, and instant medical loan underwriting to ensure your health and financial security.
            </p>
            <div className='flex gap-4'>
                <div className='p-3 bg-slate-50 rounded-xl border border-slate-100 hover:text-primary hover:border-primary/30 transition-all cursor-pointer'><MessageCircle className='w-5 h-5' /></div>
                <div className='p-3 bg-slate-50 rounded-xl border border-slate-100 hover:text-primary hover:border-primary/30 transition-all cursor-pointer'><Code className='w-5 h-5' /></div>
                <div className='p-3 bg-slate-50 rounded-xl border border-slate-100 hover:text-primary hover:border-primary/30 transition-all cursor-pointer'><Briefcase className='w-5 h-5' /></div>
            </div>
        </div>

        {/* ------- Center Side ------- */}
        <div>
            <p className='text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider'>Company</p>
            <ul className='flex flex-col gap-3 text-slate-500 font-medium'>
                <li className='hover:text-primary transition-colors cursor-pointer'>Home Portal</li>
                <li className='hover:text-primary transition-colors cursor-pointer'>About Intelligence</li>
                <li className='hover:text-primary transition-colors cursor-pointer'>Contact Institution</li>
                <li className='hover:text-primary transition-colors cursor-pointer'>Privacy Protocol</li>
            </ul>
        </div>

        {/* ------- Right Side ------- */}
        <div>
            <p className='text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider'>Connect</p>
            <ul className='flex flex-col gap-4 text-slate-500 font-medium'>
                <li className='flex items-center gap-3 hover:text-primary transition-colors cursor-pointer'><Phone className='w-4 h-4' /> +1-212-456-7890</li>
                <li className='flex items-center gap-3 hover:text-primary transition-colors cursor-pointer'><Mail className='w-4 h-4' /> audit@mediroute.ai</li>
                <li className='flex items-center gap-3 hover:text-primary transition-colors cursor-pointer'><MapPin className='w-4 h-4' /> Global Clinical Center</li>
            </ul>
        </div>

      </div>

      {/* ------- Copyright Text ------- */}
      <div className='px-4'>
        <hr className='border-slate-200' />
        <p className='py-8 text-sm text-center text-slate-400 font-bold uppercase tracking-[0.2em]'>
            Copyright 2024 @ MediRoute AI - Institutional Clinical Intelligence
        </p>
      </div>
    </div>
  )
}

export default Footer
