import React, { useState } from 'react';
import { Check, Bell, User } from 'lucide-react';

const MembershipPlans = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  return (
    <div className="min-h-screen bg-green-950 text-white">
      {/* Header - Exact match */}
      <div className="flex justify-between items-center px-8 py-4 bg-green-900/30 border-b border-green-800/30">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">🏋️</span>
          </div>
          <span className="text-orange-400 font-bold text-base">FitnessPro</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white font-medium">Home</a>
          <a href="#" className="text-gray-300">Workouts</a>
          <a href="#" className="text-gray-300">Nutrition</a>
          <a href="#" className="text-gray-300">Community</a>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-orange-800" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Membership Title */}
        <h1 className="text-4xl font-bold mb-12">Membership</h1>

        {/* Current Plan */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Current Plan</h2>
          
          <div className="flex justify-between items-center">
            {/* Left side - Plan details */}
            <div>
              <div className="text-sm text-gray-400 mb-1">Active</div>
              <div className="text-xl font-bold mb-2">Premium</div>
              <div className="text-gray-400 text-sm mb-6">Next payment on July 15, 2024</div>
              <button className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded-lg text-sm font-medium">
                Manage
              </button>
            </div>

            {/* Right side - Membership card */}
            <div className="w-72 h-44 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 rounded-2xl relative overflow-hidden">
              {/* Card content */}
              <div className="absolute inset-0 p-6">
                {/* Fitness silhouette in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-32 bg-orange-500/40 rounded-full flex items-center justify-center">
                    <div className="text-orange-800 text-4xl">🏃‍♀️</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Your Plan */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Upgrade Your Plan</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Premium Card */}
            <div className="bg-green-900/50 border border-green-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Premium</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-gray-400 text-sm ml-1">/month</span>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-3" />
                  <span className="text-gray-300 text-sm">Unlimited access to all workouts</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-3" />
                  <span className="text-gray-300 text-sm">Personalized nutrition plans</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-3" />
                  <span className="text-gray-300 text-sm">Community support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-3" />
                  <span className="text-gray-300 text-sm">Progress tracking</span>
                </div>
              </div>
              
              <button className="w-full bg-green-700 hover:bg-green-600 py-3 rounded-xl text-white font-medium">
                Upgrade
              </button>
            </div>

            {/* Premium Plus Card */}
            <div className="bg-green-900/50 border border-green-800/50 rounded-2xl p-6 relative">
              {/* Best Value Badge */}
              <div className="absolute -top-2 right-4">
                <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold">
                  Best Value
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Premium Plus</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">$29.99</span>
                <span className="text-gray-400 text-sm ml-1">/month</span>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-3" />
                  <span className="text-gray-300 text-sm">All Premium features</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-3" />
                  <span className="text-gray-300 text-sm">1:1 coaching sessions</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-3" />
                  <span className="text-gray-300 text-sm">Advanced analytics</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-3" />
                  <span className="text-gray-300 text-sm">Exclusive content</span>
                </div>
              </div>
              
              <button className="w-full bg-green-700 hover:bg-green-600 py-3 rounded-xl text-white font-medium">
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="max-w-lg">
          <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
          
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Enter card number"
                className="w-full bg-green-900/30 border border-green-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-600"
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-green-900/30 border border-green-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full bg-green-900/30 border border-green-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-600"
                />
              </div>
            </div>

            {/* Name on Card */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Name on Card</label>
              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="Enter name"
                className="w-full bg-green-900/30 border border-green-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-600"
              />
            </div>

            {/* Update Button */}
            <div className="pt-4 flex justify-end">
              <button className="bg-green-400 hover:bg-green-300 text-green-900 py-3 px-6 rounded-xl font-semibold text-sm">
                Update Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;