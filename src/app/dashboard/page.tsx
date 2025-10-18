// src/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// THE FIRST FIX: Define a specific type for our user session
type UserSession = {
  status: string;
  user_id: number;
  organization_id: number;
  role: string;
};

export default function DashboardPage() {
  const router = useRouter();
  // Use our new UserSession type instead of 'any'
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const session = Cookies.get('userSession');
    if (session) {
      setUser(JSON.parse(session));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('userSession');
    router.push('/');
  };

  if (!user) {
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
          {/* THE SECOND FIX: Replace the apostrophe in "you'll" */}
          <p className="text-gray-500">
            This is where you&apos;ll manage your categories, topics, and suggestions.
          </p>
          <p className="mt-2 text-gray-400">Organization ID: {user.organization_id}</p>
        </div>
      </main>
    </div>
  );
}
