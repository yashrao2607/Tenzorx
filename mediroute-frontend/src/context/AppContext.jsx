import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { assets } from "../assets/assets";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8011"

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)

    // FETCH NATIONAL HOSPITAL DATASET
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/hospitals')
            if (data.success) {
                // Map backend hospital schema to frontend 'doctors' schema for compatibility
                const mappedHospitals = data.hospitals.map(h => ({
                    _id: `hosp-${h.hospital_id}`,
                    name: h.hospital_name,
                    image: h.image || assets.doc1, 
                    speciality: h.specialties && h.specialties.length > 0 ? h.specialties[0] : h.procedure,
                    specialties: h.specialties || [],
                    degree: h.tier,
                    experience: `${h.reputation_score} Rating`,
                    about: `Institutional clinical partner in ${h.city}, ${h.state}. Tier: ${h.tier}. ER Wait Time: ${h.er_wait_time} mins.`,
                    fees: h.estimated_total_cost || 500,
                    address: {
                        line1: h.city,
                        line2: h.state
                    },
                    city: h.city,
                    state: h.state
                }))

                // Deduplicate for general listing
                const uniqueHospitals = [];
                const seenNames = new Set();
                mappedHospitals.forEach(h => {
                    if (!seenNames.has(h.name)) {
                        seenNames.add(h.name);
                        uniqueHospitals.push(h);
                    }
                });

                setDoctors(uniqueHospitals)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to load clinical dataset")
        }
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/get-user-profile/' + token)
            if (data.success) {
                setUserData(data.userData)
            }
        } catch (error) {
            console.log(error)
            if (error.response?.status === 404) {
                // If token is invalid/not found, clear it
                setToken('')
                localStorage.removeItem('token')
            }
        }
    }

    useEffect(() => {
        // getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, 
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider