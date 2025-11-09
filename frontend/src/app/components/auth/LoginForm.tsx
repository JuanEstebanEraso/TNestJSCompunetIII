'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth/auth.service';
import { LoginDto } from '@/app/interfaces/auth.interface';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginDto>({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(formData);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Icono de balón - aquí puedes colocar tu icono */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          {/* Icono de balón aquí */}
          <span className="text-2xl">⚽</span>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-[#F5F5F5] text-center mb-2">
        Greeting to All Footballers
      </h1>
      <p className="text-[#F5F5F5] text-center mb-8 opacity-90">
        Please sign in to your account
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#F5F5F5] mb-2 text-sm font-medium">
            Sign In With Email
          </label>
          
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            className="w-full bg-[#2C2C2C] text-[#F5F5F5] py-3 px-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            minLength={6}
            className="w-full bg-[#2C2C2C] text-[#F5F5F5] py-3 px-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        {/* Remember me y Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[#F5F5F5] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-[#2C2C2C] text-[#1DB954] focus:ring-[#1DB954] focus:ring-2"
            />
            <span className="text-sm">Remember me</span>
          </label>
          <a href="#" className="text-[#F5F5F5] text-sm hover:underline">
            Forgot Password
          </a>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botón de Sign In */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1DB954] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Link a Register */}
      <p className="text-center text-[#F5F5F5] mt-6 text-sm">
        Don't have an Account?{' '}
        <a href="/register" className="text-[#1DB954] hover:underline font-semibold">
          Sign Up
        </a>
      </p>
    </div>
  );
}

