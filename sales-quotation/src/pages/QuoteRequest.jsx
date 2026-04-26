import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarPanel from "../components/CalendarPanel";
import RequestorModal from "../components/RequestorModal";
import { useNavigate } from 'react-router-dom';

function QuoteRequest() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestor, setSelectedRequestor] = useState(null);
  const [tripType, setTripType] = useState('One Way or Multi Leg');
  const [aircrafts, setAircrafts] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState("");
  const [airports, setAirports] = useState([]);
  const [representative, setRepresentative] = useState("");
  const [isManualRep, setIsManualRep] = useState(false);

  // State baru untuk trips (Array of Objects)
  const [trips, setTrips] = useState([
    { adep: "", ades: "", date: "", time: "", pax: "" }
  ]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [resAircraft, resAirport] = await Promise.all([
          axios.get('https://project-ppl-backend-production-9d58.up.railway.app/api/aircraft', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://project-ppl-backend-production-9d58.up.railway.app/api/airport', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setAircrafts(resAircraft.data.data || resAircraft.data);
        setAirports(resAirport.data.data || resAirport.data);
      } catch (err) { console.error("Fetch Error:", err); }
    };
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://project-ppl-backend-production-9d58.up.railway.app/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) { console.error(err); }
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSelectRequestor = (requestor) => {
    setSelectedRequestor(requestor);
    setIsModalOpen(false);
  };

  // Auto-fill representative
  useEffect(() => {
    if (selectedRequestor && !isManualRep) {
      setRepresentative(selectedRequestor.contact_person);
    }
  }, [selectedRequestor, isManualRep]);

  // Dynamic Form Functions
  const addTrip = () => {
    setTrips([...trips, { adep: "", ades: "", date: "", time: "", pax: "" }]);
  };

  const handleTripChange = (index, field, value) => {
    const newTrips = [...trips];
    newTrips[index][field] = value;
    setTrips(newTrips);
  };

  const removeTrip = (index) => {
  // Jangan hapus jika hanya sisa 1 baris
  if (trips.length > 1) {
    const newTrips = trips.filter((_, i) => i !== index);
    setTrips(newTrips);
  }
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <RequestorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectRequestor} />
      
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
        <h1 className="text-slate-800 font-bold text-xl tracking-tight">Add New Quote Request</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 border border-red-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          LOGOUT
        </button>
      </div>

      <div className="lg:flex lg:border lg:border-slate-300 lg:m-4">
        {/* Left Side: Form */}
        <div className="flex flex-col lg:w-1/2 bg-slate-50 border-r border-slate-300 p-5">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-4 items-center'>
              
              <label className='text-md font-medium'>Requested By:</label>
              <div className='flex border-2 border-slate-300 rounded-md overflow-hidden bg-white'>
                <input type="text" className="w-full outline-none px-2 py-1" readOnly placeholder="Select Customer..." value={selectedRequestor ? selectedRequestor.company : ''}/>
                <button type="button" onClick={() => setIsModalOpen(true)} className="p-2 bg-slate-100 hover:bg-slate-200"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>
              </div>

              <label className='text-md font-medium flex items-center gap-2'>
                Representative:
                <div className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={isManualRep} onChange={(e) => setIsManualRep(e.target.checked)} />
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Input Manual</span>
                </div>
              </label>
              <input type="text" className={`w-full border-2 rounded-md px-2 py-1 ${!isManualRep ? 'bg-slate-100 text-slate-500' : 'bg-white'}`} value={representative} onChange={(e) => setRepresentative(e.target.value)} readOnly={!isManualRep} />

              <label className='text-md font-medium'>Aircraft:</label>
              <div className='relative'>
                <select className="w-full border-2 border-slate-300 rounded-md px-2 py-1.5 appearance-none bg-white cursor-pointer" value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.target.value)}>
                  <option value="">-- Select Aircraft --</option>
                  {aircrafts.map((ac) => <option key={ac.id} value={ac.id}>{ac.name}</option>)}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </div>
              </div>

              <label className='text-md font-medium'>Trip Type:</label>
              <div className='relative'>
                <select className="w-full border-2 border-slate-300 rounded-md px-2 py-1.5 appearance-none bg-white cursor-pointer" value={tripType} onChange={(e) => setTripType(e.target.value)}>
                  <option value="One Way or Multi Leg">One Way or Multi Leg</option>
                  <option value="Round Trip">Round Trip</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className='mt-8 flex justify-end gap-3'>
              {tripType === 'Round Trip' && (
                <button type="button" onClick={addTrip} className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 flex items-center justify-center font-bold rounded-full shadow-md transition-all active:scale-90">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
              )}
              <button className="bg-blue-500 hover:bg-blue-700 text-white px-8 py-2 font-bold rounded shadow-md transition-all active:scale-95">
                Submit
              </button>
            </div>

            {/* Dynamic Table Section */}
            <div className='mt-10 overflow-x-auto'>
              <div className='grid grid-cols-6 gap-2 border-b pb-1 mb-2 font-bold text-xs text-slate-600 text-center'>
                <label>ADEP</label><label>ADES</label><label>DATE LT</label><label>TIME LT</label><label>PAX</label><label>ACTION</label>
              </div>

              {trips.map((trip, index) => (
                <div key={index} className='grid grid-cols-6 gap-2 mb-2 animate-in fade-in slide-in-from-top-1'>
                  <select className='border-2 border-slate-300 rounded-md px-1 py-1 text-sm bg-white' value={trip.adep} onChange={(e) => handleTripChange(index, 'adep', e.target.value)}>
                    <option value="">Select...</option>
                    {airports.map((ap) => <option key={ap.id} value={ap.code}>{ap.code}</option>)}
                  </select>
                  <select className='border-2 border-slate-300 rounded-md px-1 py-1 text-sm bg-white' value={trip.ades} onChange={(e) => handleTripChange(index, 'ades', e.target.value)}>
                    <option value="">Select...</option>
                    {airports.map((ap) => <option key={ap.id} value={ap.code}>{ap.code}</option>)}
                  </select>
                  <input type="date" className='border-2 border-slate-300 rounded-md px-1 py-1 text-sm' value={trip.date} onChange={(e) => handleTripChange(index, 'date', e.target.value)} />
                  <input type="time" className='border-2 border-slate-300 rounded-md px-1 py-1 text-sm' value={trip.time} onChange={(e) => handleTripChange(index, 'time', e.target.value)} />
                  <input type="number" className='border-2 border-slate-300 rounded-md px-1 py-1 text-sm' value={trip.pax} onChange={(e) => handleTripChange(index, 'pax', e.target.value)} />
                  {/* TOMBOL DELETE */}
                  <div className='flex justify-center'>
                    {index > 0 ? (
                      <button 
                        type="button" 
                        onClick={() => removeTrip(index)}
                        className="text-red-500 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                        title="Remove this leg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    ) : (
                      <div className="w-[30px]"></div> // Spacer untuk baris pertama agar sejajar
                    )}
                  </div>
                </div>
              ))}
            </div>

          </form>
        </div>

        {/* Right Side: Calendar */}
        <div className="lg:w-1/2 bg-slate-50 border-l border-slate-300">
          <h1 className="text-white bg-blue-500 font-bold text-xl p-3">Calendar Availability</h1>
          <div className="p-2">
            <CalendarPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuoteRequest;