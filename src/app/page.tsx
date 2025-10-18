// src/app/page.tsx

"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import the router
import Cookies from 'js-cookie'; // Import js-cookie

export default function Home() {
  const router = useRouter(); // Initialize the router
  const [organizationName, setOrganizationName] = useState('Innovate Corp');
  const [email, setEmail] = useState('admin@innovatecorp.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        organization_name: organizationName,
        email: email,
        password: password,
      });

      // Handle a successful login
      console.log('Login successful:', response.data);
      
      // Save user data in a cookie (expires in 1 day)
      Cookies.set('userSession', JSON.stringify(response.data), { expires: 1 });
      
      // Redirect to the dashboard
      router.push('/dashboard');

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'An unknown error occurred.');
      } else {
        setError('Login failed. An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // The JSX for the form remains the same
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        {/* ... your form JSX remains exactly the same ... */}
        <h1 className="mb-2 text-center text-3xl font-bold">AgentSync</h1>
        <p className="mb-6 text-center text-gray-400">Admin & Manager Portal</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="organization" className="mb-2 block text-sm font-medium text-gray-300">
              Organization Name
            </label>
            <input
              id="organization"
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Innovate Corp"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              placeholder="admin@innovatecorp.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-900/50 p-3 text-center text-sm text-red-300">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
