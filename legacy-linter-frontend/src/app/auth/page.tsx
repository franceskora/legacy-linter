// src/app/auth/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Make sure Link is imported
import axios from 'axios';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      setError("API URL is not configured.");
      return;
    }

    if (isSignUp) {
      try {
        await axios.post(`${apiUrl.replace('/chat/', '/auth/register')}`, {
          full_name: fullName,
          email: email,
          password: password,
        });
        router.push('/dashboard');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.detail || 'Registration failed.');
        } else {
          setError('An unknown error occurred.');
        }
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 mt-2">
            to Legacy Linter
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" id="name" required 
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500" 
                placeholder="Your Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" id="email" required 
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" required 
                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* RE-ADDED: Terms and Conditions (Sign Up Only) */}
          {isSignUp && (
            <div className="flex items-center">
              <input id="terms-check" type="checkbox" required className="h-4 w-4 text-sky-600 border-gray-300 rounded" />
              <label htmlFor="terms-check" className="ml-2 block text-sm text-gray-900">I agree to the <Link href="/terms" className="text-sky-600 hover:underline">Terms and Conditions</Link></label>
            </div>
          )}

          {/* RE-ADDED: Bot Protection */}
          <div className="flex items-center">
            <input id="robot-check" type="checkbox" className="h-4 w-4 text-sky-600 border-gray-300 rounded" />
            <label htmlFor="robot-check" className="ml-2 block text-sm text-gray-900">I am not a robot</label>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full block text-center bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-700 transition-colors">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="font-semibold text-sky-600 hover:underline ml-1">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}