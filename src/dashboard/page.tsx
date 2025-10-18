// src/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = Cookies.get('userSession');
    if (session) {
      setUser(JSON.parse(session));
    } else {
      // If no session, redirect to login
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('userSession');
    router.push('/');
  };

  if (!user) {
    // You can show a loading spinner here
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">AgentSync Dashboard</h1>
          <div>
            <span className="mr-4 text-gray-300">Welcome, {user.role}!</span>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <h2 className="mb-6 text-3xl">Workspace Customization</h2>
        <div className="rounded-lg border border-dashed border-gray-700 bg-gray-800 p-12 text-center">
          <p className="text-gray-500">
            This is where you'll manage your categories, topics, and suggestions.
          </p>
          <p className="mt-2 text-gray-400">Organization ID: {user.organization_id}</p>
        </div>
      </main>
    </div>
  );
}
