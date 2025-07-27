import React from 'react';

const SocialLogin = () => {
  return (
    <div className="mt-4">
      <p className="text-center text-gray-400">or continue with</p>
      <div className="flex justify-center mt-2">
        <button className="bg-white text-green-800 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition">
          Google
        </button>
      </div>
    </div>
  );
};
export default SocialLogin;