import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Star, Building2, ChevronRight, AlertCircle, Info, Shield } from 'lucide-react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8011';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, 12); }, [center, map]);
  return null;
};

const CITY_COORDS = {
  "Nagpur": [21.1458, 79.0882], "Mumbai": [19.0760, 72.8777], "Pune": [18.5204, 73.8567],
  "Delhi": [28.6139, 77.2090], "Bangalore": [12.9716, 77.5946]
};

const HospitalMapView = ({ user, diagnosis, onSelect }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [sortBy, setSortBy] = useState('cost');

  const city = user?.city || 'Delhi';
  const center = CITY_COORDS[city] || [28.6139, 77.2090];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/hospitals-by-city`, {
          city, 
          procedure: diagnosis.recommended_procedure, 
          icd10_code: diagnosis.icd10_code,
          comorbidities: user.health_records?.comorbidities || []
        });
        setData(response.data);
      } catch (err) { setError('Could not fetch hospital data.'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [city, diagnosis]);

  if (loading) return (
    <div className="h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse">Mapping Regional Providers...</p>
      </div>
    </div>
  );

  const sortedHospitals = [...(data?.hospitals || [])].sort((a, b) => {
    if (sortBy === 'quality') return (b.reputation_score || 0) - (a.reputation_score || 0);
    return a.estimated_total_cost - b.estimated_total_cost;
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8 h-[750px]">
        {/* Map Pane */}
        <div className="lg:w-1/2 h-[400px] lg:h-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl z-0">
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={center} />
            {data?.hospitals.map(h => (
              <Marker key={h.hospital_id} position={[h.lat, h.lon]} eventHandlers={{ click: () => setSelectedId(h.hospital_id) }}>
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-slate-900">{h.hospital_name}</h4>
                    <p className="text-primary font-bold text-lg">₹{h.estimated_total_cost.toLocaleString()}</p>
                    <button onClick={() => onSelect(h, data)} className="mt-3 bg-primary text-white text-[10px] px-4 py-2 rounded-lg w-full font-bold uppercase tracking-wider">
                      Select Hospital
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* List Pane */}
        <div className="lg:w-1/2 h-full flex flex-col gap-6">
          <div className="glass-card p-8 border-primary/10 bg-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-primary font-black">Regional Audit: {city}</span>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{diagnosis.recommended_procedure}</h3>
                <p className="text-slate-500 text-sm mt-1">Diagnosis: <span className="font-bold text-slate-700">{diagnosis.condition}</span></p>
                
                {diagnosis.clinical_rationale && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3 items-start"
                  >
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                      <Shield className="w-3 h-3 text-indigo-500" />
                    </div>
                    <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                      <span className="font-bold text-indigo-900 block mb-0.5">Clinical Context Used:</span>
                      {diagnosis.clinical_rationale}
                    </p>
                  </motion.div>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">Market Median</p>
                <p className="text-3xl font-black text-primary">₹{data?.fair_market_price.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Sort Results</label>
              <select className="input-field text-xs py-2 px-4" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="cost">Cost (Lowest First)</option>
                <option value="quality">Quality (Highest Rated)</option>
              </select>
            </div>

            {data?.applied_factors && data.applied_factors.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {data.applied_factors.map((f, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={idx} 
                    className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-2 shadow-sm"
                  >
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
                      {f.condition}: <span className="text-amber-600">{f.impact}</span> Risk Load
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Lowest</p>
                <p className="text-sm font-black text-slate-700">₹{data?.min_cost.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Highest</p>
                <p className="text-sm font-black text-slate-700">₹{data?.max_cost.toLocaleString()}</p>
              </div>
              <div className="bg-secondary p-4 rounded-2xl border border-primary/20">
                <p className="text-[10px] text-primary uppercase font-bold mb-1">Available</p>
                <p className="text-sm font-black text-primary">{data?.hospital_count} Hospitals</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {sortedHospitals.map((h, i) => (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={h.hospital_id} onClick={() => setSelectedId(h.hospital_id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer group ${selectedId === h.hospital_id ? 'bg-secondary border-primary shadow-lg shadow-primary/5' : 'bg-white border-slate-100 hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl transition-colors ${selectedId === h.hospital_id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">{h.hospital_name}</h4>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                          <Star className="w-3.5 h-3.5 fill-amber-500" /> {h.reputation_score} Rating
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${h.tier === 'Premium' ? 'text-purple-500' : 'text-slate-400'}`}>
                          {h.tier} Class
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${selectedId === h.hospital_id ? 'text-primary' : 'text-slate-800'}`}>₹{h.estimated_total_cost.toLocaleString()}</p>
                    <button onClick={(e) => { e.stopPropagation(); onSelect(h, data); }} className={`mt-3 flex items-center gap-1.5 ml-auto text-[10px] font-black uppercase tracking-widest transition-all ${selectedId === h.hospital_id ? 'text-primary' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>
                      Select <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedId === h.hospital_id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-8 pt-8 border-t border-primary/10 overflow-hidden">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-8">
                        {Object.entries(h.breakdown || h.cost_breakdown || {}).map(([label, val]) => (
                          <div key={label} className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 capitalize">{label.replace(/_/g, ' ')}</span>
                            <span className="font-bold text-slate-700">₹{val.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => onSelect(h, data)} className="btn-primary w-full py-4 text-base tracking-tight font-bold">
                        Continue to Digital Underwriting
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMapView;
