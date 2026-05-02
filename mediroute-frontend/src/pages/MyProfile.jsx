import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const { token, userData } = useContext(AppContext)
    const navigate = useNavigate()

    return userData ? (
        <div className='max-w-2xl flex flex-col gap-4 text-sm pt-5'>
            <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary overflow-hidden">
                    <img className='w-full h-full object-cover' src={assets.profile_pic} alt="" />
                </div>
                <div>
                    <p className='font-bold text-3xl text-slate-900'>{userData.name}</p>
                    <p className='text-slate-500 font-medium'>Institutional ID: <span className="text-primary font-bold">{userData.user_id}</span></p>
                </div>
            </div>

            <hr className='bg-slate-200 h-[1px] border-none' />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {/* Identification */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
                    <p className='text-gray-600 font-bold underline uppercase tracking-wider text-[10px]'>Institutional Identification</p>
                    <div className='grid grid-cols-[1fr_2fr] gap-y-4 text-[#363636]'>
                        <p className='font-bold text-slate-400 uppercase text-[10px]'>PAN Card</p>
                        <p className='text-slate-900 font-bold font-mono tracking-widest'>{userData.pan}</p>
                        
                        <p className='font-bold text-slate-400 uppercase text-[10px]'>Aadhaar</p>
                        <p className='text-slate-900 font-bold font-mono tracking-widest'>{userData.aadhaar}</p>
                    </div>
                </div>

                {/* Account Details */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
                    <p className='text-gray-600 font-bold underline uppercase tracking-wider text-[10px]'>Clinical Profile</p>
                    <div className='grid grid-cols-[1fr_2fr] gap-y-4 text-[#363636]'>
                        <p className='font-bold text-slate-400 uppercase text-[10px]'>Employment</p>
                        <p className='text-slate-900 font-bold'>{userData.occupation}</p>
                        
                        <p className='font-bold text-slate-400 uppercase text-[10px]'>Age</p>
                        <p className='text-slate-900 font-bold'>{userData.age} Years</p>
                    </div>
                </div>

                {/* Contact & Location */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 md:col-span-2">
                    <p className='text-gray-600 font-bold underline uppercase tracking-wider text-[10px]'>Communication & Location</p>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-[#363636]'>
                        <div>
                            <p className='font-bold text-slate-400 text-[10px] uppercase mb-1'>Phone Number</p>
                            <p className='text-slate-900 font-bold'>{userData.phone}</p>
                        </div>
                        <div>
                            <p className='font-bold text-slate-400 text-[10px] uppercase mb-1'>Registered City</p>
                            <p className='text-slate-900 font-bold'>{userData.city}</p>
                        </div>
                        <div>
                            <p className='font-bold text-slate-400 text-[10px] uppercase mb-1'>Account Status</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <p className='text-green-600 font-bold'>Institutional Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-6 flex gap-3'>
                <button onClick={() => navigate('/mediroute')} className='bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all'>New Clinical Intake</button>
                <button onClick={() => window.print()} className='border border-slate-200 px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all'>Export Identity Card</button>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Synchronizing Institutional Identity...</p>
        </div>
    )
}

export default MyProfile