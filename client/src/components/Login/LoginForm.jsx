import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validation';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'user', // always user
    },
  });

  const onSubmit = async (data) => {
    await login({ ...data, role: 'user' }); // force role to user
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
      {/* Email Input */}
      <div>
        <input
          type="email"
          placeholder="Email"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-700 disabled:cursor-not-allowed text-white rounded transition flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
};

export default LoginForm;