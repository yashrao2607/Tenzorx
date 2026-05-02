import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SpecialityMenu = () => {
    return (
        <div className='flex flex-col items-center gap-6 py-16 px-4' id='speciality'>
            <div className='text-center space-y-2 mb-6'>
                <h2 className='text-3xl md:text-4xl font-black text-slate-900 tracking-tight'>Clinical <span className='text-primary'>Analysis</span> Domains</h2>
                <p className='max-w-xl mx-auto text-slate-500 font-medium text-base leading-relaxed'>Select a clinical domain to explore AI-driven diagnostic insights.</p>
            </div>
            
            <div className='flex sm:justify-center gap-4 pt-2 w-full overflow-x-auto scrollbar-hide pb-6 px-2'>
                {specialityData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.03 }}
                        viewport={{ once: true }}
                        className='will-change-transform'
                    >
                        <Link 
                            to={`/doctors/${item.speciality}`} 
                            onClick={() => scrollTo(0, 0)} 
                            className='flex flex-col items-center gap-4 cursor-pointer flex-shrink-0 group'
                        >
                            <div className='w-24 h-24 sm:w-28 sm:h-28 glass-card flex items-center justify-center p-4 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300 transform-gpu'>
                                <img className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300' src={item.image} alt={item.speciality} />
                            </div>
                            <p className='text-sm font-bold text-slate-700 group-hover:text-primary transition-colors tracking-tight uppercase'>{item.speciality}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu