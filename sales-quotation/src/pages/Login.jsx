import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Pastikan sudah install: npm install axios

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 1. Tambahkan state untuk menangkap input
  const [email, setEmail] = useState(''); // Laravel biasanya menggunakan email secara default
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 2. Tembak ke API Backend Railway
      // Ganti URL dengan URL Railway Anda
      const response = await axios.post('https://project-ppl-backend-production-9d58.up.railway.app/api/auth/login', {
        email: email,
        password: password
      });

      console.log(response.data);

      // 3. Simpan token ke localStorage agar tetap login meski di-refresh
      const token = response.data.token; // Sesuaikan dengan key dari backend
      localStorage.setItem('token', token); 

      console.log("Login sukses!");
      setLoading(false);
      
      // Jalankan fungsi success jika ada (misal untuk set state user di App.js)
      if (onLoginSuccess) onLoginSuccess(response.data.user);
      
      navigate('/quote-request'); 
    } catch (err) {
      setLoading(false);
      // Tangani error (salah password/user tidak ditemukan)
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali akun Anda.');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* SISI KIRI: Visual & Judul */}
      <div className="hidden w-1/2 flex-col justify-center bg-blue-800 p-16 text-white lg:flex">
        <div className="max-w-md">
          <h1 className="text-6xl font-black italic tracking-tighter">SALES QUOTATION APPS</h1>
        </div>
      </div>

      {/* Form Login */}
      <div className="flex w-full flex-col justify-center bg-white p-8 md:p-20 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          
          <div className="mb-10 lg:hidden">
              <h2 className="text-4xl font-bold italic tracking-tighter text-blue-800">SALES QUOTATION APPS</h2>
              <p className="text-slate-500">Silakan login</p>
          </div>

          <div className="mb-10 hidden lg:block">
            <h2 className="text-3xl font-bold text-slate-800">Login</h2>
          </div>

          {/* Menampilkan Pesan Error jika ada */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input 
                type="email" 
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input 
                type="password" 
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`group relative w-full overflow-hidden py-4 font-bold text-white transition-all rounded-2xl ${
                loading ? 'bg-slate-400' : 'bg-blue-900 hover:bg-blue-800 active:scale-[0.98]'
              }`}
            >
              <span className="relative z-10">{loading ? 'LOADING...' : 'LOGIN'}</span>
            </button>
          </form>

          <div className="mt-16 border-t border-slate-100 pt-8 text-xs text-slate-400">
            <p className="font-semibold">Sales Quotation Apps</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;