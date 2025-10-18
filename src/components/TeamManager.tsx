// src/components/TeamManager.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  role: 'Admin' | 'Manager' | 'Contributor';
}

interface TeamManagerProps {
  organizationId: number;
}

export default function TeamManager({ organizationId }: TeamManagerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Manager' | 'Contributor'>('Contributor');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/organizations/${organizationId}/users`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [organizationId]);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;

    try {
      const response = await axios.post(`${apiUrl}/organizations/${organizationId}/users`, {
        email: newUserEmail,
        password: 'password123', // A temporary password
        role: newUserRole,
      });
      setUsers([...users, response.data]);
      setNewUserEmail('');
      alert(`Invitation sent to ${newUserEmail}! Their temporary password is 'password123'.`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Failed to invite user.');
      } else {
        setError('Failed to invite user.');
      }
    }
  };

  if (loading) return <div>Loading team members...</div>;

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <h3 className="mb-4 text-2xl font-semibold">Manage Team</h3>
      
      <form onSubmit={handleInviteUser} className="mb-6 rounded-md border border-gray-700 p-4">
        <h4 className="mb-3 text-lg font-medium">Invite New User</h4>
        {error && <p className="mb-3 text-red-400">{error}</p>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="new.user@example.com"
            className="rounded-md bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring-blue-500 md:col-span-2"
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value as any)}
            className="rounded-md bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option>Contributor</option>
            <option>Manager</option>
          </select>
          <button type="submit" className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 md:col-span-3">
            Send Invitation
          </button>
        </div>
      </form>
      
      <div className="space-y-3">
        <h4 className="text-lg font-medium">Current Team</h4>
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-md bg-gray-700 p-4">
            <span className="text-lg">{user.email}</span>
            <span className="rounded-full bg-gray-600 px-3 py-1 text-sm font-medium">{user.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
