import React, { useState } from 'react';
import AdminLoginForm from '../../components/Login/AdminLoginForm';
import AdminRegisterForm from '../../components/Login/AdminRegisterForm';
import Girl from '../../assets/GIRL.jpg';

const AdminAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  return (
    <div className="min-h-screen bg-gradient-to-br bg-green-900 flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-4 md:p-8 lg:p-12 flex flex-col justify-center">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Admin Panel</h1>
            <p className="text-teal-100 text-sm sm:text-base md:text-lg mt-1 sm:mt-2">Admin access only</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 sm:p-6">
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 px-4 rounded text-sm font-medium transition ${
                  activeTab === 'login'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                }`}
              >
                Admin Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 px-4 rounded text-sm font-medium transition ${
                  activeTab === 'register'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                }`}
              >
                Admin Register
              </button>
            </div>
            <div className="mt-4 sm:mt-6">
              {activeTab === 'login' ? <AdminLoginForm /> : <AdminRegisterForm />}
            </div>
          </div>
        </div>
        {/* Image Section */}
        <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-teal-800/20">
          <img src={Girl} alt="Admin Panel" className="h-81 sm:h-82 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;