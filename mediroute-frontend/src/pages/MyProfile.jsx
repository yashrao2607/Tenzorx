import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const { token, userData, setUserData, backendUrl } = useContext(AppContext)
    const navigate = useNavigate()

    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState({})

    useEffect(() => {
        if (userData) {
            setEditData(userData)
        }
    }, [userData])

    const handleUpdate = async () => {
        try {
            // Since there's no dedicated update endpoint, we'll simulate it locally 
            // and maybe the register endpoint handles updates if the ID exists? 
            // Actually, let's just update the local state for now as a mock.
            setUserData(editData)
            setIsEdit(false)
            // toast.success("Profile Updated Successfully")
        } catch (error) {
            console.error(error)
        }
    }

    return userData ? (
        <div className='max-w-4xl mx-auto glass-card p-10 mt-10 backdrop-blur-2xl'>
            <div className='flex flex-col gap-6 text-sm'>
            <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-4xl shadow-md uppercase">
                    {userData?.name ? userData.name.charAt(0) : "U"}
                </div>
                <div>
                    {isEdit 
                        ? <input className='bg-slate-50 text-3xl font-bold text-slate-900 border-b-2 border-primary outline-none px-1' type="text" value={editData.name} onChange={e => setEditData(prev => ({...prev, name: e.target.value}))} />
                        : <p className='font-bold text-3xl text-slate-900'>{userData.name}</p>
                    }
                    <p className='text-slate-500 font-medium mt-1'>Institutional ID: <span className="text-primary font-bold">{userData.user_id}</span></p>
                </div>
            </div>

            <hr className='bg-slate-200 h-[1px] border-none' />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {/* Identification */}
                <div className="glass-panel p-6 shadow-lg shadow-slate-100/20 flex flex-col gap-4">
                    <p className='text-gray-600 font-bold underline uppercase tracking-wider text-[10px]'>Institutional Identification</p>
                    <div className='grid grid-cols-[1fr_2fr] gap-y-4 text-[#363636]'>
                        <p className='font-bold text-slate-400 uppercase text-[10px]'>PAN Card</p>
                        {isEdit 
                            ? <input className='bg-white border rounded px-2 py-1 uppercase' type="text" value={editData.pan} onChange={e => setEditData(prev => ({...prev, pan: e.target.value}))} />
                            : <p className='text-slate-900 font-bold font-mono tracking-widest'>{userData.pan}</p>
                        }
                        
                        <p className='font-bold text-slate-400 uppercase text-[10px]'>Aadhaar</p>
                        {isEdit 
                            ? <input className='bg-white border rounded px-2 py-1' type="text" value={editData.aadhaar} onChange={e => setEditData(prev => ({...prev, aadhaar: e.target.value}))} />
                            : <p className='text-slate-900 font-bold font-mono tracking-widest'>{userData.aadhaar}</p>
                        }
                    </div>
                </div>

                {/* Account Details */}
                <div className="glass-panel p-6 shadow-lg shadow-slate-100/20 flex flex-col gap-4">
                    <p className='text-gray-600 font-bold underline uppercase tracking-wider text-[10px]'>Clinical Profile</p>
                    <div className='grid grid-cols-[1fr_2fr] gap-y-4 text-[#363636]'>
                        <p className='font-bold text-slate-400 uppercase text-[10px]'>Employment</p>
                        {isEdit 
                            ? <select className='bg-white border rounded px-2 py-1' value={editData.occupation} onChange={e => setEditData(prev => ({...prev, occupation: e.target.value}))}>
                                <option value="Salaried">Salaried</option>
                                <option value="Self-Employed">Self-Employed</option>
                                <option value="Student">Student</option>
                                <option value="Other">Other</option>
                              </select>
                            : <p className='text-slate-900 font-bold'>{userData.occupation}</p>
                        }
                        
                        <p className='font-bold text-slate-400 uppercase text-[10px]'>Age</p>
                        {isEdit 
                            ? <input className='bg-white border rounded px-2 py-1' type="number" value={editData.age} onChange={e => setEditData(prev => ({...prev, age: e.target.value}))} />
                            : <p className='text-slate-900 font-bold'>{userData.age} Years</p>
                        }

                        <p className='font-bold text-slate-400 uppercase text-[10px]'>Gender</p>
                        {isEdit 
                            ? <select className='bg-white border rounded px-2 py-1' value={editData.gender} onChange={e => setEditData(prev => ({...prev, gender: e.target.value}))}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            : <p className='text-slate-900 font-bold'>{userData.gender || 'Not Specified'}</p>
                        }
                    </div>
                </div>

                {/* Contact & Location */}
                <div className="glass-panel p-6 shadow-lg shadow-slate-100/20 flex flex-col gap-4 md:col-span-2">
                    <p className='text-gray-600 font-bold underline uppercase tracking-wider text-[10px]'>Communication & Location</p>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-[#363636]'>
                        <div>
                            <p className='font-bold text-slate-400 text-[10px] uppercase mb-1'>Phone Number</p>
                            {isEdit 
                                ? <input className='bg-white border rounded px-2 py-1 w-full' type="text" value={editData.phone} onChange={e => setEditData(prev => ({...prev, phone: e.target.value}))} />
                                : <p className='text-slate-900 font-bold'>{userData.phone}</p>
                            }
                        </div>
                        <div>
                            <p className='font-bold text-slate-400 text-[10px] uppercase mb-1'>Registered City</p>
                            {isEdit 
                                ? <input className='bg-white border rounded px-2 py-1 w-full' type="text" value={editData.city} onChange={e => setEditData(prev => ({...prev, city: e.target.value}))} />
                                : <p className='text-slate-900 font-bold'>{userData.city}</p>
                            }
                        </div>
                        <div>
                            <p className='font-bold text-slate-400 text-[10px] uppercase mb-1'>Account Status</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <p className='text-green-600 font-bold uppercase text-[10px] tracking-wider'>Institutional Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-6 flex gap-3'>
                {isEdit 
                    ? <button onClick={handleUpdate} className='bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:scale-105 active:scale-95 transition-all'>Save Profile</button>
                    : <button onClick={() => setIsEdit(true)} className='bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all'>Edit Profile</button>
                }
                <button onClick={() => navigate('/mediroute')} className='border border-slate-200 px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all'>New Clinical Intake</button>
                <button onClick={() => window.print()} className='border border-slate-200 px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all'>Export Identity Card</button>
            </div>
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