import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { MapPin, Star, Building2 } from 'lucide-react'

const hospitalData = [
  { id: 1, name: "Apollo Hospital", city: "Pune", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800", specialty: "Multi-Specialty", rating: 4.9 },
  { id: 2, name: "Fortis Medical Center", city: "Mumbai", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800", specialty: "Cardiology", rating: 4.8 },
  { id: 3, name: "Max Healthcare", city: "Delhi", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800", specialty: "Oncology", rating: 4.9 },
  { id: 4, name: "Manipal Hospital", city: "Bangalore", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800", specialty: "Neurology", rating: 4.7 },
  { id: 5, name: "Medanta Medicity", city: "Gurugram", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800", specialty: "Transplant", rating: 4.8 },
  { id: 6, name: "Lilavati Hospital", city: "Mumbai", image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800", specialty: "General", rating: 4.6 },
  { id: 7, name: "H.N. Reliance Foundation", city: "Mumbai", image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=800", specialty: "Advanced Care", rating: 4.9 },
  { id: 8, name: "KIMS Hospital", city: "Hyderabad", image: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=800", specialty: "Pediatrics", rating: 4.7 },
  { id: 9, name: "Nanavati Hospital", city: "Mumbai", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800", specialty: "Orthopedics", rating: 4.8 },
  { id: 10, name: "Kokilaben Hospital", city: "Mumbai", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800", specialty: "Tertiary Care", rating: 4.9 },
];

const TopHospitals = () => {
    const navigate = useNavigate()
    const { token } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-10 py-24 px-4' id='hospitals'>
            <div className='text-center space-y-4 mb-10'>
                <div className='inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full text-emerald-600 text-xs font-bold uppercase tracking-wider'>
                    <Building2 className='w-3 h-3' /> Institutional Network
                </div>
                <h2 className='text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight'>Top-Rated <span className='text-primary'>Facilities</span></h2>
                <p className='max-w-2xl mx-auto text-slate-500 font-medium text-lg leading-relaxed'>Select a verified institutional facility for AI cost auditing and diagnostic validation.</p>
            </div>

            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 sm:px-10'>
                {hospitalData.map((item, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        viewport={{ once: true }}
                        onClick={() => { navigate(`/mediroute`); scrollTo(0, 0) }} 
                        className='glass-card group cursor-pointer hover:shadow-2xl transition-all duration-500 bg-white/40 rounded-xl overflow-hidden' 
                    >
                        <div className="relative h-72 overflow-hidden">
                            <img 
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                                src={item.image} 
                                alt={item.name} 
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                                }}
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                            <div className="absolute top-4 right-4 glass-panel bg-white/90 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
                                <Star className='w-3 h-3 text-amber-500 fill-amber-500' />
                                <span className='text-[10px] font-bold text-slate-700'>{item.rating}</span>
                            </div>
                            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <MapPin className='w-3 h-3' />
                                <span className='text-[10px] font-bold uppercase tracking-widest'>{item.city}</span>
                            </div>
                        </div>
                        <div className='p-6 space-y-3'>
                            <div className='flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest'>
                                <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></div>
                                Verified Partner
                            </div>
                            <p className='text-slate-900 text-xl font-bold leading-tight group-hover:text-primary transition-colors'>{item.name}</p>
                            <p className='text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-100 w-fit px-3 py-1 rounded-lg'>{item.specialty}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!token && (
                <button 
                    onClick={() => { navigate('/login'); scrollTo(0, 0) }} 
                    className='btn-primary mt-12 px-16 text-lg'
                >
                    View All Facilities
                </button>
            )}
        </div>
    )
}

export default TopHospitals
