import { useState, useEffect } from "react";
import axios from "axios";

function CalendarPanel() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [aircrafts, setAircrafts] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState("");
  const [availabilityData, setAvailabilityData] = useState([]);
  const [bookedData, setBookedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const BASE_URL = 'https://project-ppl-backend-production.up.railway.app/api';

  // 1. Fetch Daftar Aircraft
  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/aircraft`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Laravel Resource biasanya mengembalikan data di dalam property 'data'
        setAircrafts(response.data.data || response.data);
      } catch (err) {
        console.error("Error fetching aircrafts:", err);
      }
    };
    fetchAircrafts();
  }, []);

  // 2. Fetch Data Jadwal saat Aircraft Dipilih
  useEffect(() => {
    if (selectedAircraft) {
      const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
          // Mengambil data dari aircraft-available dan draft-quotation secara bersamaan
          const [resAvailable, resBooked] = await Promise.all([
            axios.get(`${BASE_URL}/aircraft-available?aircraft_id=${selectedAircraft}`, config),
            axios.get(`${BASE_URL}/draft-quotation?aircraft_id=${selectedAircraft}`, config)
          ]);
          
          setAvailabilityData(resAvailable.data.data || resAvailable.data);
          setBookedData(resBooked.data.data || resBooked.data);
        } catch (err) {
          console.error("Error fetching schedules:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      // Reset data jika tidak ada pesawat yang dipilih
      setAvailabilityData([]);
      setBookedData([]);
    }
  }, [selectedAircraft]);

  // Logika Kalender
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay });

  // 3. Logika Penentuan Warna
  const getDayStatus = (day) => {
    if (!selectedAircraft) return "bg-white text-slate-400";

    const checkDate = new Date(year, month, day);
    checkDate.setHours(0, 0, 0, 0);

    // Kriteria 1: Cek Booked (Draft Quotation) - PRIORITAS UTAMA (MERAH)
    const isBooked = bookedData.some(item => {
      const start = new Date(item.departure_date); // Sesuaikan dengan kolom db anda
      const end = new Date(item.arrival_date);     // Sesuaikan dengan kolom db anda
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return checkDate >= start && checkDate <= end;
    });

    if (isBooked) return "bg-red-500 text-white font-bold";

    // Kriteria 2: Cek Available (Aircraft Available) - (HIJAU)
    const isAvailable = availabilityData.some(item => {
      const start = new Date(item.available_start);
      const end = new Date(item.available_end);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return checkDate >= start && checkDate <= end;
    });

    if (isAvailable) return "bg-green-500 text-white font-bold";

    // Kriteria 3: Selain itu (PUTIH)
    return "bg-white text-slate-800 border border-slate-100";
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="p-4 bg-white rounded-b-xl shadow-inner">
      
      {/* INPUT SELECT AIRCRAFT */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
          Aircraft Schedule View
        </label>
        <select 
          className="w-full border-2 border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 bg-slate-50 text-sm font-medium transition-all"
          value={selectedAircraft}
          onChange={(e) => setSelectedAircraft(e.target.value)}
        >
          <option value="">-- Select Aircraft to View Schedule --</option>
          {aircrafts.map(ac => (
            <option key={ac.id} value={ac.id}>{ac.name}</option>
          ))}
        </select>
      </div>

      <div className="border border-slate-100 rounded-xl p-4">
        {/* HEADER NAVIGASI BULAN */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 className="font-black text-slate-800 text-lg tracking-tight">
            {monthName.toUpperCase()} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* NAMA HARI */}
        <div className="grid grid-cols-7 text-center text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* GRID TANGGAL */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {emptyDays.map((_, i) => (
            <div key={"e" + i} className="h-10"></div>
          ))}

          {days.map(day => (
            <div
              key={day}
              className={`h-10 w-full flex items-center justify-center rounded-lg text-xs transition-all shadow-sm ${getDayStatus(day)}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* LEGEND / KETERANGAN */}
      <div className="mt-6 flex justify-between px-2 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm shadow-sm"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm shadow-sm"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white border border-slate-200 rounded-sm shadow-sm"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">N/A</span>
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-center text-[10px] text-blue-500 font-bold animate-pulse">
          UPDATING SCHEDULE...
        </div>
      )}
    </div>
  );
}

export default CalendarPanel;