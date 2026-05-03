import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Shield, MapPin, Star, Search } from 'lucide-react'
import { AppContext } from '../context/AppContext'

// Professional Hospital Images for variety
const hospitalImages = [
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1504813184591-01592fd03cfd?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800",
];

const Hospitals = () => {
    const { speciality } = useParams()
    const { doctors, userData } = React.useContext(AppContext)
    const [filterHosp, setFilterHosp] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate()

    const categories = [
        "General physician",
        "Cardiology",
        "Orthopedics",
        "Oncology",
        "Neurology",
        "Gastroenterology",
        "Ophthalmology",
        "Urology",
        "Maternity",
        "Pediatricians"
    ]

    const applyFilter = () => {
        let filtered = doctors;

        if (speciality) {
            filtered = doctors.filter(h => 
                (h.specialties || []).some(s => {
                    const normS = s.toLowerCase();
                    const normSpec = speciality.toLowerCase();
                    if (normSpec === 'maternity') {
                        return normS === 'maternity' || normS === 'gynecology';
                    }
                    return normS === normSpec;
                })
            )
        }

        // Location-based prioritization
        if (userData && (userData.city || userData.state)) {
            const userCity = (userData.city || "").toLowerCase();
            const userState = (userData.state || "").toLowerCase();

            filtered = [...filtered].sort((a, b) => {
                const aCityMatch = (a.city || "").toLowerCase() === userCity;
                const bCityMatch = (b.city || "").toLowerCase() === userCity;
                if (aCityMatch && !bCityMatch) return -1;
                if (!aCityMatch && bCityMatch) return 1;

                const aStateMatch = (a.state || "").toLowerCase() === userState;
                const bStateMatch = (b.state || "").toLowerCase() === userState;
                if (aStateMatch && !bStateMatch) return -1;
                if (!aStateMatch && bStateMatch) return 1;

                return 0;
            });
        }

        setFilterHosp(filtered)
    }

    useEffect(() => {
        applyFilter()
    }, [speciality, doctors, userData])

    return (
        <div className='pt-5'>
            <p className='text-slate-600 font-medium text-lg mb-6'>Browse through our institutional clinical partners.</p>
            <div className='flex flex-col sm:flex-row items-start gap-8 mt-5'>
                
                {/* --- Sidebar Filters --- */}
                <button 
                    className={`py-2 px-4 border border-slate-200 rounded-xl sm:hidden transition-all ${showFilter ? 'bg-primary text-white' : 'bg-white'}`} 
                    onClick={() => setShowFilter(prev => !prev)}
                >
                    Filters
                </button>
                
                <div className={`flex-col gap-3 text-sm text-slate-600 ${showFilter ? 'flex' : 'hidden sm:flex'} w-full sm:w-64`}>
                    {categories.map((cat, idx) => (
                        <p 
                            key={idx}
                            onClick={() => speciality === cat ? navigate('/doctors') : navigate(`/doctors/${cat}`)} 
                            className={`w-full pl-4 py-3 border border-slate-200 rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${speciality === cat ? "bg-primary-light text-primary border-primary font-bold shadow-sm" : ""}`}
                        >
                            {cat}
                        </p>
                    ))}
                </div>

                {/* --- Hospital Grid --- */}
                <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10'>
                    {filterHosp.map((item, index) => (
                        <div 
                            key={index}
                            onClick={() => navigate('/mediroute')} 
                            className='group border border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white'
                        >
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                                <img 
                                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                                    src={item.image} 
                                    alt={item.name} 
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                                    }}
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl border border-white/50">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-bold text-slate-900">{item.rating}</span>
                                </div>
                            </div>
                            
                            <div className='p-6'>
                                <div className='flex items-center gap-2 mb-3'>
                                    <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                                        <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></div>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Verified</span>
                                    </div>
                                    <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100 flex items-center gap-1.5 ml-auto">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.city}, {item.state || 'IN'}</span>
                                    </div>
                                </div>
                                
                                <h3 className='text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight mb-2'>
                                    {item.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                    <Shield className="w-4 h-4 text-primary/60" />
                                    {item.speciality}
                                </div>
                                
                                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-primary font-bold text-sm">View Analysis</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                        <Search className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Hospitals
