import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-slate-500'>
        <p>ABOUT <span className='text-slate-800 font-bold'>MEDIROUTE AI</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img 
          className='w-full md:max-w-[360px] rounded-2xl shadow-lg' 
          src={assets.about_image} 
          alt="MediRoute AI Mission" 
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80"
          }}
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-slate-600'>
          <p>Welcome to <span className="font-bold text-primary text-base">MediRoute AI</span>, your institutional partner in navigating the complexities of modern healthcare through advanced clinical intelligence. We empower patients and providers with AI-driven diagnostic insights, regional cost auditing, and seamless medical financial bridges.</p>
          <p>MediRoute AI is committed to transparency and excellence in healthcare technology. Our platform leverages high-fidelity AI models to provide multi-turn diagnostic analysis, ensuring every medical journey is backed by data-driven precision. We bridge the gap between clinical needs and financial feasibility, making world-class healthcare accessible to all.</p>
          <b className='text-slate-800 text-lg'>Our Vision</b>
          <p>Our vision is to eliminate healthcare uncertainty. By providing instant cost transparency and underwriting clinical loans through institutional partnerships, we ensure that no patient ever has to choose between their health and their financial stability.</p>
        </div>
      </div>

      <div className='text-xl my-4 text-slate-800'>
        <p>WHY <span className='text-primary font-bold'>CHOOSE MEDIROUTE</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border border-slate-100 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-slate-600 cursor-pointer rounded-l-2xl md:rounded-l-3xl shadow-sm hover:shadow-xl'>
          <b>PRECISION:</b>
          <p>AI-driven clinical intake and multi-turn analysis for high-fidelity diagnostic pathways.</p>
        </div>
        <div className='border-y md:border-y-0 md:border-x border-slate-100 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-slate-600 cursor-pointer shadow-sm hover:shadow-xl'>
          <b>TRANSPARENCY: </b>
          <p>Regional cost auditing that provides real-world price benchmarks across institutional facilities.</p>
        </div>
        <div className='border border-slate-100 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-slate-600 cursor-pointer rounded-r-2xl md:rounded-r-3xl shadow-sm hover:shadow-xl'>
          <b>ACCESSIBILITY:</b>
          <p>Instant medical loan underwriting to bridge the gap between diagnosis and treatment.</p>
        </div>
      </div>

    </div>
  )
}

export default About
