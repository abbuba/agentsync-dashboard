// src/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import CategoryManager from '@/components/CategoryManager';
import SuggestionManager from '@/components/SuggestionManager'; // 1. Import the new component

type UserSession = {
  status: string;
  user_id: number;
  organization_id: number;
  role: string;
};

export default function DashboardPage() {
  const router = useRouter();
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
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
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
        <CategoryManager organizationId={user.organization_id} />
        <SuggestionManager organizationId={user.organization_id} /> {/* 2. Add the component here */}
      </main>
    </div>
  );
}
