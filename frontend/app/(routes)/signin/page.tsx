"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Config } from '@/config';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const API_URL = Config.URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // It's common to send the email directly as 'email'
        body: JSON.stringify({ username:email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in.');
      }
      
      localStorage.setItem('authToken', data.token);
      router.push('/draw');

    } catch (e:any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-950">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="relative z-10 w-full max-w-lg p-8 space-y-8 bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-slate-400">Sign in to access your canvas</p>
        </div>
        
        {error && (
            <div className="p-3 text-sm text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute w-5 h-5 top-3 left-3 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-white bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute w-5 h-5 top-3 left-3 text-slate-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-white bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:bg-cyan-800 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? 'Signing In...' : <><LogIn className="w-5 h-5 mr-2" /> Sign In</>}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-slate-400">
          Do not have an account?{' '}
          <Link href="/signup" className="font-medium text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}