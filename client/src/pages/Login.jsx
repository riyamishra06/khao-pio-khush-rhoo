import React, { useState } from 'react';
import AuthTabs from '../components/Login/AuthTabs';
import LoginForm from '../components/Login/LoginForm';
import RegisterForm from '../components/Login/RegisterForm';
import FeatureShowcase from '../components/Login/FeatureShowcase';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      <div className="relative z-10 min-h-screen flex">
        <div className="flex-1 flex items-center justify-center p-8 max-w-md mx-auto">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Welcome to FitTrack</h1>
              <p className="text-gray-400">Your fitness journey starts here</p>
            </div>

            <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="bg-green-800/20 backdrop-blur-sm rounded-2xl p-8 border border-green-700/50">
              {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-green-800/20 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <FeatureShowcase />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
