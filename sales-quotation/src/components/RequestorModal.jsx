import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RequestorModal({ isOpen, onClose, onSelect }) {
  const [view, setView] = useState('list'); // 'list' atau 'add'
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // State untuk Form Add Customer
  const [formData, setFormData] = useState({
    company: '',
    representative: '1',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Indonesia',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      setView('list'); // Reset ke list setiap kali modal dibuka
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://project-ppl-backend-production-9d58.up.railway.app/api/customer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Menangani jika data dibungkus dalam properti 'data' (Laravel Resource)
      const result = response.data.data || response.data;
      setCustomers(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Gagal mengambil data customer", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://project-ppl-backend-production-9d58.up.railway.app/api/customer', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Customer added successfully!");
      setFormData({ // Reset form
        company: '', representative: '1', contact_person: '', email: '',
        phone: '', address: '', city: '', province: '',
        postal_code: '', country: 'Indonesia', notes: ''
      });
      setView('list'); // Kembali ke tampilan tabel
      fetchCustomers(); // Refresh data
    } catch (err) {
      console.error("Failed to add customer", err);
      alert("Failed to add customer. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  // Filter pencarian
  const filteredCustomers = customers.filter(c => 
    c.contact_person?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="border-b p-4 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {view === 'list' ? 'Select Requestor' : 'Add New Customer'}
            </h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              {view === 'list' ? 'Choose a customer for this quotation' : 'Fill in customer details'}
            </p>
          </div>
          <button 
            onClick={() => setView(view === 'list' ? 'add' : 'list')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              view === 'list' 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {view === 'list' ? (
              <><span className="text-lg">+</span> New Customer</>
            ) : (
              '← Back to List'
            )}
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          {view === 'list' ? (
            <div className="flex flex-col h-full">
              {/* Search Bar */}
              <div className="p-4 bg-white sticky top-0 z-10 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or company..."
                    className="w-full rounded-lg border-2 border-slate-200 px-10 py-2.5 outline-none focus:border-blue-500 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="absolute left-3 top-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="p-4">
                <table className="w-full border-collapse text-left text-sm border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-4 w-12 text-center">Select</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs">Contact Person</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs">Company</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs">Email</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-xs">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {loading ? (
                      <tr><td colSpan="5" className="p-10 text-center animate-pulse text-slate-500 font-medium">Loading data...</td></tr>
                    ) : filteredCustomers.length > 0 ? (
                      filteredCustomers.map((cust) => (
                        <tr 
                          key={cust.id} 
                          className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedId === cust.id ? 'bg-blue-100' : ''}`}
                          onClick={() => setSelectedId(cust.id)}
                        >
                          <td className="p-4 text-center">
                            <input 
                              type="radio" 
                              checked={selectedId === cust.id} 
                              readOnly 
                              className="h-5 w-5 text-blue-600 cursor-pointer"
                            />
                          </td>
                          <td className="p-4 font-bold text-slate-700">{cust.contact_person}</td>
                          <td className="p-4 text-slate-600">{cust.company}</td>
                          <td className="p-4 text-slate-600">{cust.email}</td>
                          <td className="p-4 text-slate-600">{cust.phone}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="p-10 text-center text-slate-400">No customers found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* FORM ADD CUSTOMER */
            <form id="add-customer-form" onSubmit={handleAddCustomer} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                <input required type="text" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Contact Person</label>
                <input required type="text" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.contact_person} onChange={(e) => setFormData({...formData, contact_person: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input required type="email" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input required type="text" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                <textarea required className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none h-20 resize-none" 
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                <input required type="text" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Province</label>
                <input required type="text" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Postal Code</label>
                <input required type="number" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
                <input required type="text" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Notes</label>
                <input type="text" className="border-2 border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none" 
                  value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
            </form>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t p-4 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          
          {view === 'list' ? (
            <button 
              onClick={() => {
                const selected = customers.find(c => c.id === selectedId);
                if (selected) onSelect(selected);
              }}
              disabled={!selectedId}
              className="px-10 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:bg-slate-300 shadow-lg transition-all active:scale-95"
            >
              OK
            </button>
          ) : (
            <button 
              form="add-customer-form"
              type="submit"
              disabled={loading}
              className="px-10 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 disabled:bg-slate-300 shadow-lg transition-all active:scale-95"
            >
              {loading ? "Saving..." : "Save Customer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestorModal;