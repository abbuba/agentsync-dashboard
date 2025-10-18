// src/app/dashboard/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import CategoryManager from '@/components/CategoryManager';
import SuggestionManager from '@/components/SuggestionManager';
import TeamManager from '@/components/TeamManager'; // 1. Import the new component

type UserSession = {
  status: string; user_id: number; organization_id: number; role: string;
};

type Tab = 'workspace' | 'team'; // Define tab types

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('workspace'); // 2. Add state for active tab

  useEffect(() => {
    const session = Cookies.get('userSession');
    if (session) { setUser(JSON.parse(session)); } 
    else { router.push('/'); }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('userSession');
    router.push('/');
  };

  if (!user) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  // Only render Team Management tab if user is an Admin
  const canManageTeam = user.role === 'Admin';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">AgentSync Dashboard</h1>
          <div>
            <span className="mr-4 text-gray-300">Welcome, {user.role}!</span>
            <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700">Logout</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        {/* 3. Add Tab Navigation */}
        <div className="mb-8 flex border-b border-gray-700">
          <button onClick={() => setActiveTab('workspace')} className={`px-6 py-3 text-lg font-medium ${activeTab === 'workspace' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>
            Workspace
          </button>
          {canManageTeam && (
            <button onClick={() => setActiveTab('team')} className={`px-6 py-3 text-lg font-medium ${activeTab === 'team' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>
              Team Management
            </button>
          )}
        </div>

        {/* 4. Conditionally render content based on active tab */}
        {activeTab === 'workspace' && (
          <div>
            <h2 className="mb-6 text-3xl">Workspace Customization</h2>
            <CategoryManager organizationId={user.organization_id} />
            <SuggestionManager organizationId={user.organization_id} />
          </div>
        )}
        
        {activeTab === 'team' && canManageTeam && (
          <div>
            <h2 className="mb-6 text-3xl">Team Management</h2>
            <TeamManager organizationId={user.organization_id} />
          </div>
        )}
      </main>
    </div>
  );
}
