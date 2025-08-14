'use client'

import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { apiClient, ApiError } from '../../lib/apiClient';

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiClient.login({
        username: username.trim(),
        password: password
      });

      // Your API returns { token: "jwt-token" } on success
      if (response.token) {
        // Set the auth cookie with the received token
        document.cookie = `auth-token=${response.token}; path=/; max-age=86400; SameSite=Strict`;
        
        // Get the redirect URL from query params or default to adminPanel
        const redirectUrl = searchParams.get('redirect') || '/adminPanel';
        router.push(redirectUrl);
      } else {
        setError(t('auth.errors.invalidCredentials'));
      }
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle different types of errors based on your API
      if (apiError.status === 400) {
        // BadRequest - Username and password are required
        setError(apiError.message || t('auth.errors.fieldsRequired') || 'Username and password are required');
      } else if (apiError.status === 401) {
        // Unauthorized - Invalid credentials
        setError(apiError.message || t('auth.errors.invalidCredentials'));
      } else if (typeof apiError.status === 'number' && apiError.status >= 500) {
        setError(t('auth.errors.serverError'));
      } else if (apiError.message.includes('Network error')) {
        setError(t('auth.errors.networkError'));
      } else {
        setError(apiError.message || t('auth.errors.genericError'));
      }
      
      console.error('Login error:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111111' }}>
      <Header></Header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Login Form Container */}
          <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: '#1a1a1a' }}>
            {/* Welcome Section */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl" style={{ color: '#111111' }}>R</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('auth.welcomeBack')}</h2>
              <p className="text-sm sm:text-base" style={{ color: '#888888' }}>
                {t('auth.signInDescription')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  {t('auth.username.label')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5" style={{ color: '#888888' }} />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="block w-full pl-10 pr-3 py-3 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: '#111111', 
                      border: '1px solid #333333'
                    }}
                    placeholder={t('auth.username.placeholder')}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  {t('auth.password.label')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5" style={{ color: '#888888' }} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="block w-full pl-10 pr-12 py-3 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: '#111111', 
                      border: '1px solid #333333'
                    }}
                    placeholder={t('auth.password.placeholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={showPassword ? t('auth.password.hidePassword') : t('auth.password.showPassword')}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !username.trim() || !password}
                className="w-full py-3 px-4 cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('auth.signingIn')}</span>
                  </div>
                ) : (
                  t('auth.signIn')
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer></Footer>
    </div>
  );
}