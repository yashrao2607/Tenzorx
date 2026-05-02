import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Star, Building2, ChevronRight, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 12);
  return null;
};

const CITY_COORDS = {
  "Nagpur": [21.1458, 79.0882],
  "Mumbai": [19.0760, 72.8777],
  "Pune": [18.5204, 73.8567],
  "Delhi": [28.6139, 77.2090],
  "Bangalore": [12.9716, 77.5946]
};

const HospitalMapView = ({ user, diagnosis, onSelect }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const city = user?.city || 'Delhi';
  const center = CITY_COORDS[city] || [28.6139, 77.2090];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8001/api/hospitals-by-city', {
          city: city,
          procedure: diagnosis.recommended_procedure,
          icd10_code: diagnosis.icd10_code
        });
        setData(response.data);
      } catch (err) {
        setError('Could not fetch regional hospital data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city, diagnosis]);

  if (loading) return (
    <div className="h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-slate-400 animate-pulse">Mapping Regional Healthcare Providers...</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="glass-card p-6 max-w-3xl mx-auto text-center border-rose-500/20">
        <p className="text-rose-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 h-[750px]">
        {/* Left Pane: Map */}
        <div className="lg:w-1/2 h-[400px] lg:h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-0">
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <ChangeView center={center} />
            {data?.hospitals.map(h => (
              <Marker 
                key={h.hospital_id} 
                position={[h.lat, h.lon]}
                eventHandlers={{ click: () => setSelectedId(h.hospital_id) }}
              >
                <Popup>
                  <div className="p-1">
                    <h4 className="font-bold text-slate-900">{h.hospital_name}</h4>
                    <p className="text-teal-600 font-bold">₹{h.estimated_total_cost.toLocaleString()}</p>
                    <button 
                      onClick={() => onSelect(h, data)}
                      className="mt-2 bg-teal-600 text-white text-[10px] px-3 py-1 rounded-md w-full font-bold uppercase tracking-wider"
                    >
                      Select & Audit
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right Pane: Hospital Comparison */}
        <div className="lg:w-1/2 h-full flex flex-col gap-6 overflow-hidden">
          <div className="glass-card p-6 border-teal-500/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-teal-400 font-bold">Regional Audit: {city}</span>
                <h3 className="text-2xl font-bold">{diagnosis.condition}</h3>
                <p className="text-slate-400 text-sm">ICD-10 Code: <span className="text-slate-200 font-mono">{diagnosis.icd10_code}</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Fair Market Price</p>
                <p className="text-2xl font-black text-white">₹{data?.fair_market_price.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">City Min</p>
                <p className="text-sm font-bold">₹{data?.min_cost.toLocaleString()}</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">City Max</p>
                <p className="text-sm font-bold">₹{data?.max_cost.toLocaleString()}</p>
              </div>
              <div className="bg-teal-500/10 p-3 rounded-xl border border-teal-500/20">
                <p className="text-[10px] text-teal-400 uppercase font-bold mb-1">Hospitals</p>
                <p className="text-sm font-bold text-teal-400">{data?.hospital_count}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            <AnimatePresence>
              {data?.hospitals.map((h, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={h.hospital_id}
                  onClick={() => setSelectedId(h.hospital_id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                    selectedId === h.hospital_id 
                      ? 'bg-teal-500/10 border-teal-500 shadow-lg shadow-teal-500/10' 
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-colors ${
                        selectedId === h.hospital_id ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100">{h.hospital_name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                            <Star className="w-3 h-3 fill-amber-400" /> {h.quality_score} Quality
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            h.tier === 'Premium' ? 'text-purple-400' : h.tier === 'High' ? 'text-blue-400' : 'text-slate-500'
                          }`}>
                            {h.tier} Tier
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black ${selectedId === h.hospital_id ? 'text-teal-400' : 'text-slate-200'}`}>
                        ₹{h.estimated_total_cost.toLocaleString()}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelect(h, data); }}
                        className={`mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedId === h.hospital_id ? 'text-teal-400 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        Select Hospital <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {selectedId === h.hospital_id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-6 pt-6 border-t border-teal-500/20"
                    >
                      <h5 className="text-[10px] uppercase font-black text-teal-500 tracking-widest mb-4">Cost Structure Breakdown</h5>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                        {Object.entries(h.cost_breakdown).map(([label, val]) => (
                          <div key={label} className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 capitalize">{label.replace(/_/g, ' ')}</span>
                            <span className="font-mono text-slate-300">₹{val.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      
                      {h.estimated_total_cost > data.fair_market_price * 1.1 && (
                        <div className="mt-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                          <AlertCircle className="text-rose-400 w-4 h-4 shrink-0" />
                          <p className="text-[10px] text-rose-300 leading-tight">
                            Warning: This hospital is {Math.round((h.estimated_total_cost / data.fair_market_price - 1) * 100)}% above regional fair price. 
                            Loan approval may require manual review.
                          </p>
                        </div>
                      )}

                      <button 
                        onClick={() => onSelect(h, data)}
                        className="btn-primary w-full mt-6 py-3 text-sm font-bold"
                      >
                        Proceed to Loan Underwriting
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMapView;
