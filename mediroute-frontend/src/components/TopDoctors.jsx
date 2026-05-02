import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const TopDoctors = () => {

    const navigate = useNavigate()

    const { doctors, userData } = useContext(AppContext)

    const getTopDoctors = () => {
        let sorted = [...doctors];
        if (userData && (userData.city || userData.state)) {
            const userCity = (userData.city || "").toLowerCase();
            const userState = (userData.state || "").toLowerCase();

            sorted.sort((a, b) => {
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
        return sorted.slice(0, 10);
    }

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-800 md:mx-10'>
            <h1 className='text-3xl font-medium'>Expert Clinicians for AI Diagnostics</h1>
            <p className='sm:w-1/3 text-center text-sm'>Connect with verified specialists to validate your AI-generated treatment paths and underwriting reports.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {getTopDoctors().map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 group shadow-sm hover:shadow-xl' key={index}>
                        <div className="h-48 overflow-hidden">
                            <img className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' src={item.image} alt="" />
                        </div>
                        <div className='p-4 bg-white'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available !== false ? 'text-green-500' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available !== false ? 'bg-green-500' : "bg-gray-500"}`}></p>
                                <p>{item.city}, {item.state}</p>
                            </div>
                            <p className='text-[#262626] text-lg font-medium truncate'>{item.name}</p>
                            <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-primary text-white font-bold px-12 py-4 rounded-xl mt-10 hover:shadow-2xl transition-all active:scale-95'>View National Network</button>
        </div>

    )
}

export default TopDoctors