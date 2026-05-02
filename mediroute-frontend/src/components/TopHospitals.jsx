import React from 'react'
import { useNavigate } from 'react-router-dom'

const hospitalData = [
  { id: 1, name: "Apollo Hospital", city: "Pune", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800", specialty: "Multi-Specialty" },
  { id: 2, name: "Fortis Medical Center", city: "Mumbai", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800", specialty: "Cardiology" },
  { id: 3, name: "Max Healthcare", city: "Delhi", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800", specialty: "Oncology" },
  { id: 4, name: "Manipal Hospital", city: "Bangalore", image: "https://images.unsplash.com/photo-1504813184591-01592fd03cfd?auto=format&fit=crop&q=80&w=800", specialty: "Neurology" },
  { id: 5, name: "Medanta Medicity", city: "Gurugram", image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800", specialty: "Transplant" },
  { id: 6, name: "Lilavati Hospital", city: "Mumbai", image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800", specialty: "General" },
  { id: 7, name: "H.N. Reliance Foundation", city: "Mumbai", image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=800", specialty: "Advanced Care" },
  { id: 8, name: "KIMS Hospital", city: "Hyderabad", image: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=800", specialty: "Pediatrics" },
  { id: 9, name: "Nanavati Hospital", city: "Mumbai", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800", specialty: "Orthopedics" },
  { id: 10, name: "Kokilaben Hospital", city: "Mumbai", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800", specialty: "Tertiary Care" },
];

const TopHospitals = () => {
    const navigate = useNavigate()

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-800 md:mx-10'>
            <h1 className='text-3xl font-medium'>Top-Rated Clinical Facilities</h1>
            <p className='sm:w-1/3 text-center text-sm'>Select a verified institutional facility for AI cost auditing and diagnostic validation.</p>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-5 gap-y-8 px-3 sm:px-0'>
                {hospitalData.map((item, index) => (
                    <div 
                        onClick={() => { navigate(`/mediroute`); scrollTo(0, 0) }} 
                        className='group border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white' 
                        key={index}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
                                src={item.image} 
                                alt={item.name} 
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                                }}
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm">
                                {item.city}
                            </div>
                        </div>
                        <div className='p-5'>
                            <div className='flex items-center gap-2 text-xs text-green-500 mb-2 font-medium'>
                                <p className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></p>
                                <p>Verified Partner</p>
                            </div>
                            <p className='text-slate-900 text-lg font-bold leading-tight mb-1'>{item.name}</p>
                            <p className='text-slate-500 text-sm'>{item.specialty}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => { navigate('/login'); scrollTo(0, 0) }} 
                className='bg-secondary text-primary font-bold px-12 py-3 rounded-full mt-10 hover:bg-primary hover:text-white transition-all shadow-md'
            >
                View All Facilities
            </button>
        </div>
    )
}

export default TopHospitals
