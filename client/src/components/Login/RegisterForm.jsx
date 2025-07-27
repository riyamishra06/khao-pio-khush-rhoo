import React from 'react';
import SocialLogin from './SocialLogin';

const RegisterForm = () => {
  return (
    <div className="space-y-4">
      <input type="text" placeholder="Full Name" className="w-full px-4 py-2 rounded bg-green-900/50 text-white border border-green-600 placeholder:text-green-400" />
      <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded bg-green-900/50 text-white border border-green-600 placeholder:text-green-400" />
      <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded bg-green-900/50 text-white border border-green-600 placeholder:text-green-400" />
      <button className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded transition">Register</button>
      <SocialLogin />
    </div>
  );
};

export default RegisterForm;