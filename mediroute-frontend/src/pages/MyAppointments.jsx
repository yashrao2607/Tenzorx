import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Activity, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const [history, setHistory] = useState({ searches: [], loans: [] })
    const [loading, setLoading] = useState(true)

    const getUserHistory = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/get-user-history/' + token)
            if (data.success) {
                setHistory(data)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to load clinical history")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            getUserHistory()
        }
    }, [token])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Retrieving Diagnostic History...</p>
            </div>
        )
    }

    return (
        <div className='max-w-6xl mx-auto py-10 px-4'>
            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-primary/10 rounded-2xl">
                    <Activity className="text-primary w-8 h-8" />
                </div>
                <div>
                    <h1 className='text-3xl font-bold text-slate-900'>My Clinical Diagnostics</h1>
                    <p className='text-slate-500 font-medium'>Track your medical assessments and underwriting status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Diagnostic Search History */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
                        <Clock className="w-5 h-5 text-primary" /> Assessment History
                    </h2>
                    <div className="space-y-4">
                        {history.searches.length === 0 ? (
                            <div className="glass-card p-10 text-center text-slate-400 font-medium">No diagnostic searches found.</div>
                        ) : (
                            history.searches.map((item, index) => (
                                <div key={index} className="glass-card p-6 hover:translate-x-2 transition-transform cursor-default border-l-4 border-l-primary">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Inquiry #{index + 1}</p>
                                            <p className="text-lg font-bold text-slate-900">{item.result?.recommended_procedure || "General Consultation"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(item.timestamp).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="glass-panel p-3 mb-4">
                                        <p className="text-xs text-slate-500 italic">"{item.symptom_text}"</p>
                                    </div>
                                    <div className="flex gap-4 text-xs">
                                        <div className="px-3 py-1 bg-primary/5 rounded-full text-primary font-bold">ICD-10: {item.result?.icd10_code}</div>
                                        <div className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-bold">Urgency: {item.result?.urgency_level || "Medium"}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Underwriting & Loans History */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 px-2">
                        <CreditCard className="w-5 h-5 text-emerald-600" /> Underwriting Decisions
                    </h2>
                    <div className="space-y-4">
                        {history.loans.length === 0 ? (
                            <div className="glass-card p-10 text-center text-slate-400 font-medium">No loan applications found.</div>
                        ) : (
                            history.loans.map((item, index) => (
                                <div key={index} className={`glass-card p-6 border-l-4 ${item.decision === 'APPROVED' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${item.decision === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                Status: {item.decision}
                                            </p>
                                            <p className="text-lg font-bold text-slate-900">₹{item.requested_amount.toLocaleString()}</p>
                                            <p className="text-xs text-slate-500 font-medium">{item.hospital_name}</p>
                                        </div>
                                        {item.decision === 'APPROVED' ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : <AlertCircle className="text-amber-500 w-6 h-6" />}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="glass-panel p-2 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Fair Market</p>
                                            <p className="text-sm font-bold text-slate-700">₹{item.fair_market_price.toLocaleString()}</p>
                                        </div>
                                        <div className="glass-panel p-2 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Procedure</p>
                                            <p className="text-sm font-bold text-slate-700">{item.procedure}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 text-right">{new Date(item.timestamp).toLocaleString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default MyAppointments