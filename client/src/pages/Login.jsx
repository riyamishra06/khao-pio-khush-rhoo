import React, { useState } from 'react';
import AuthTabs from '../components/Login/AuthTabs';
import LoginForm from '../components/Login/LoginForm';
import RegisterForm from '../components/Login/RegisterForm';
import Girl from '../assets/GIRL.jpg'

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  return (
    <div className="min-h-screen bg-gradient-to-br bg-green-900 flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-4 md:p-8 lg:p-12 flex flex-col justify-center">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Khao Pio Khush Rhoo</h1>
            <p className="text-teal-100 text-sm sm:text-base md:text-lg mt-1 sm:mt-2">Start your fitness journey today</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 sm:p-6">
            <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-4 sm:mt-6">
              {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-teal-800/20">
           <img src={Girl} alt="FitTrack Logo" className="h-81 sm:h-82 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default Login;
