import React from 'react';
import { Form, Link } from '@remix-run/react';

export default function RegisterPage() {
  // Anda bisa mengubah path background image ini sesuai kebutuhan
  const backgroundImagePath = "login-bg.png"; 

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('${backgroundImagePath}')` }}
    >
      {/* Overlay untuk memastikan kartu register terlihat jelas */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Register Card */}
      <div className="z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo - Ganti path sesuai lokasi logo Anda */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            {/* Ganti dengan path logo Anda */}
            <img src="logo.png" alt="NIGGER" className="h-8" />
          </div>
        </div>
        
        {/* Heading */}
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">Selamat Datang</h2>
        
        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mb-6">
          Sudah punya akun? <Link to="/login" className="text-blue-500 hover:underline">Masuk</Link>
        </p>
        
        {/* Register Form */}
        <Form method="post" className="space-y-4">
          {/* Nama Depan & Belakang (row) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nama Depan Field */}
            <div>
              <label htmlFor="firstName" className="sr-only">Nama Depan</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black" 
                placeholder="Nama Depan" 
                required 
              />
            </div>
            
            {/* Nama Belakang Field */}
            <div>
              <label htmlFor="lastName" className="sr-only">Nama Belakang</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black" 
                placeholder="Nama Belakang" 
              />
            </div>
          </div>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black" 
              placeholder="Email" 
              required 
            />
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black" 
              placeholder="Password" 
              required 
            />
          </div>
          
          {/* Register Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Daftar
          </button>
        </Form>
        
        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">Atau</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        {/* Google Register Button */}
        <button 
          type="button" 
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-black"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Daftar dengan Google
        </button>
      </div>
    </div>
  );
}

