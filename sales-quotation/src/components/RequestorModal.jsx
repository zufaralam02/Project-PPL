import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RequestorModal({ isOpen, onClose, onSelect }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://project-ppl-backend-production.up.railway.app/api/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
    } catch (err) {
      console.error("Gagal mengambil data customer", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data berdasarkan input search
  const filteredCustomers = customers.filter(c => 
    c.contact_person.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="border-b p-4">
          <h2 className="text-lg font-bold text-slate-800">Select Requestor</h2>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by name or company..."
            className="w-full rounded border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Area */}
        <div className="max-h-[400px] overflow-y-auto p-4 pt-0">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-blue-600 text-white">
              <tr>
                <th className="p-3"></th>
                <th className="p-3">ID</th>
                <th className="p-3">NAME</th>
                <th className="p-3">COMPANY</th>
                <th className="p-3">EMAIL</th>
                <th className="p-3">CONTACT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border">
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center">Loading data...</td></tr>
              ) : filteredCustomers.map((cust) => (
                <tr 
                  key={cust.id} 
                  className={`hover:bg-blue-50 cursor-pointer ${selectedId === cust.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedId(cust.id)}
                >
                  <td className="p-3 text-center">
                    <input 
                      type="radio" 
                      checked={selectedId === cust.id} 
                      readOnly 
                      className="h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="p-3">{cust.id}</td>
                  <td className="p-3 font-medium">{cust.contact_person}</td>
                  <td className="p-3">{cust.company}</td>
                  <td className="p-3">{cust.email}</td>
                  <td className="p-3">{cust.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button 
            onClick={onClose}
            className="rounded border border-slate-300 px-6 py-2 font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              const selected = customers.find(c => c.id === selectedId);
              if (selected) onSelect(selected);
            }}
            disabled={!selectedId}
            className="rounded bg-blue-600 px-8 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestorModal;