import React, { useState } from 'react';
import AuthTabs from '../components/Login/AuthTabs';
import LoginForm from '../components/Login/LoginForm';
import RegisterForm from '../components/Login/RegisterForm';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-800 to-teal-600 flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 md:flex-row">
        {/* Form Section */}
        <div className="w-full p-4 md:p-8 lg:p-12 flex flex-col justify-center">
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
        {/* Image Section - Hidden on small screens, visible on md and above */}
        <div className="hidden md:flex w-full items-center justify-center p-4 md:p-8 lg:p-12 bg-teal-800/20">
          <img
            src="https://i.pinimg.com/1200x/39/af/d7/39afd77693be6de29ca907da42d743a3.jpg"
            alt="Healthy Meal"
            className="rounded-xl shadow-lg object-cover w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;