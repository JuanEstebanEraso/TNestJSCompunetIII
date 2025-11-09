'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth/auth.service';
import { RegisterDto } from '@/app/interfaces/auth.interface';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterDto>({
    username: '',
    password: '',
    roles: ['user'],
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(formData);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
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
        Join the Football Community
      </h1>
      <p className="text-[#F5F5F5] text-center mb-8 opacity-90">
        Create your account to get started
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#F5F5F5] mb-2 text-sm font-medium">
            Sign Up With Email
          </label>
          
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            minLength={3}
            maxLength={100}
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

        <div>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            minLength={6}
            className="w-full bg-[#2C2C2C] text-[#F5F5F5] py-3 px-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent placeholder:text-gray-500"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botón de Sign Up */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1DB954] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      {/* Link a Login */}
      <p className="text-center text-[#F5F5F5] mt-6 text-sm">
        Already have an Account?{' '}
        <a href="/login" className="text-[#1DB954] hover:underline font-semibold">
          Sign In
        </a>
      </p>
    </div>
  );
}

