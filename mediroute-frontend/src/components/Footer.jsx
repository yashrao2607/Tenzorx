import React from 'react'
import { Shield } from 'lucide-react'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <div className='flex items-center gap-2 mb-5'>
            <div className="bg-primary p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">MediRoute <span className="text-primary">AI</span></span>
          </div>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>MediRoute AI is an institutional-grade clinical intelligence platform providing multi-turn diagnostic analysis, regional cost auditing, and medical loan underwriting to ensure healthcare transparency for all.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>PLATFORM</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className="cursor-pointer hover:text-primary">Clinical Intake</li>
            <li className="cursor-pointer hover:text-primary">Cost Auditor</li>
            <li className="cursor-pointer hover:text-primary">Loan Bridge</li>
            <li className="cursor-pointer hover:text-primary">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+91-9352339808</li>
            <li>support@mediroute.ai</li>
          </ul>
        </div>

      </div>

      <div>
        <hr className="border-slate-200" />
        <p className='py-5 text-sm text-center text-slate-500'>Copyright 2026 @ MediRoute.ai - All Rights Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
