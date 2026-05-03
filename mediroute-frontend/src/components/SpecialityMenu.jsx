import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SpecialityMenu = () => {
    const [isHovered, setIsHovered] = React.useState(false)

    return (
        <div className='flex flex-col items-center gap-6 py-16 px-4' id='speciality'>
            <div className='text-center space-y-2 mb-6'>
                <h2 className='text-3xl md:text-4xl font-black text-slate-900 tracking-tight'>Clinical <span className='text-primary'>Analysis</span> Domains</h2>
                <p className='max-w-xl mx-auto text-slate-500 font-medium text-base leading-relaxed'>Select a clinical domain to explore AI-driven diagnostic insights.</p>
            </div>
            
            <div 
                className='w-full overflow-hidden relative py-4'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.div 
                    className='flex gap-8 w-fit'
                    animate={{ x: isHovered ? undefined : ["0%", "-50%"] }}
                    transition={{ 
                        duration: 30, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                >
                    {/* Double the data for seamless loop */}
                    {[...specialityData, ...specialityData].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ 
                                scale: 1.1,
                                y: -10,
                                transition: { duration: 0.3 }
                            }}
                            className='flex-shrink-0'
                        >
                            <Link 
                                to={`/doctors/${item.speciality}`} 
                                onClick={() => scrollTo(0, 0)} 
                                className='flex flex-col items-center gap-5 cursor-pointer group'
                            >
                                <motion.div 
                                    animate={{ 
                                        y: [0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 3 + (index % 3),
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.2
                                    }}
                                    className='w-24 h-24 sm:w-32 sm:h-32 glass-card flex items-center justify-center p-5 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-300'
                                >
                                    <img 
                                        className='w-full h-full object-contain group-hover:rotate-6 transition-transform duration-500' 
                                        src={item.image} 
                                        alt={item.speciality} 
                                    />
                                </motion.div>
                                <p className='text-xs sm:text-sm font-black text-slate-600 group-hover:text-primary transition-colors tracking-widest uppercase text-center'>{item.speciality}</p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
                
                {/* Gradient Fades for the edges */}
                <div className='absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10'></div>
                <div className='absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10'></div>
            </div>
        </div>
    )
}

export default SpecialityMenu