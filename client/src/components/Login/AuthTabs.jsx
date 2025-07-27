import React from 'react';

const AuthTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex mb-8">
    <button
      onClick={() => setActiveTab('login')}
      className={`flex-1 py-3 px-6 text-center font-semibold transition-all duration-300 ${
        activeTab === 'login'
          ? 'text-white border-b-2 border-green-400'
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      Login
    </button>
    <button
      onClick={() => setActiveTab('register')}
      className={`flex-1 py-3 px-6 text-center font-semibold transition-all duration-300 ${
        activeTab === 'register'
          ? 'text-white border-b-2 border-green-400'
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      Register
    </button>
  </div>
);

export default AuthTabs;
