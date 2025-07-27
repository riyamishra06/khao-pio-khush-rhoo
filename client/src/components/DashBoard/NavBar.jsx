import React from 'react';
import { User, LogOut } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    'Dashboard',
    'Track Nutrition',
    'Reports',
    'Membership',
    'Settings',
  ];

  return (
    <nav className="bg-green-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KB</span>
            </div>
            <span className="text-orange-400 font-semibold">Khao Bhi</span>
          </div>

          <div className="flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`text-white hover:text-green-200 transition-colors ${
                  activeTab === item ? 'text-green-200' : ''
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <User size={20} className="text-gray-600" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
