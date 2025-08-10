import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validation';

const AdminRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerAdmin, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
    },
  });

const onSubmit = async (data) => {
  const { confirmPassword, ...adminData } = data;
  await registerAdmin(adminData, true); // Pass true to indicate admin registration
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
      {/* Username Input */}
      <div>
        <input
          type="text"
          placeholder="Admin Username"
          {...register('username')}
          className={`w-full px-4 py-2 rounded bg-green-900/50 text-white border placeholder:text-green-400 transition ${
            errors.username ? 'border-red-500' : 'border-green-600'
          }`}
        />
        {errors.username && (
          <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>
      {/* Email Input */}
      <div>
        <input
          type="email"
          placeholder="Admin Email"
          {...register('email')}
          className={`w-full px-4 py-2 rounded bg-green-900/50 text-white border placeholder:text-green-400 transition ${
            errors.email ? 'border-red-500' : 'border-green-600'
          }`}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      {/* Password Input */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          {...register('password')}
          className={`w-full px-4 py-2 pr-10 rounded bg-green-900/50 text-white border placeholder:text-green-400 transition ${
            errors.password ? 'border-red-500' : 'border-green-600'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      {/* Confirm Password Input */}
      <div className="relative">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          {...register('confirmPassword')}
          className={`w-full px-4 py-2 pr-10 rounded bg-green-900/50 text-white border placeholder:text-green-400 transition ${
            errors.confirmPassword ? 'border-red-500' : 'border-green-600'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-green-300"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-700 disabled:cursor-not-allowed text-white rounded transition flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Registering...
          </>
        ) : (
          'Register'
        )}
      </button>
    </form>
  );
};

export default AdminRegisterForm;