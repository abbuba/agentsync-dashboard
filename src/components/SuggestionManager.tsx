// src/components/SuggestionManager.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the shape of our Suggestion data
interface Suggestion {
  id: number;
  text: string;
  style: 'Sentence Starter' | 'Complete Phrase';
}

interface SuggestionManagerProps {
  organizationId: number;
}

export default function SuggestionManager({ organizationId }: SuggestionManagerProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [newSuggestionText, setNewSuggestionText] = useState('');
  const [newSuggestionStyle, setNewSuggestionStyle] = useState<'Sentence Starter' | 'Complete Phrase'>('Sentence Starter');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/organizations/${organizationId}/suggestions`);
      setSuggestions(response.data);
    } catch (err) {
      setError('Failed to fetch suggestions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [organizationId]);

  const handleAddSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestionText.trim()) return;

    try {
      const response = await axios.post(`${apiUrl}/organizations/${organizationId}/suggestions`, {
        text: newSuggestionText,
        style: newSuggestionStyle,
      });
      setSuggestions([...suggestions, response.data]);
      setNewSuggestionText('');
    } catch (err) {
      setError('Failed to add suggestion.');
    }
  };
  
  const handleDeleteSuggestion = async (suggestionId: number) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return;
    
    try {
        await axios.delete(`${apiUrl}/suggestions/${suggestionId}`);
        setSuggestions(suggestions.filter(sug => sug.id !== suggestionId));
    } catch (err) {
        setError('Failed to delete suggestion.');
    }
  };

  if (loading) return <div>Loading suggestions...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="mt-8 rounded-lg bg-gray-800 p-6">
      <h3 className="mb-4 text-2xl font-semibold">Manage Quick Suggestions</h3>
      
      <form onSubmit={handleAddSuggestion} className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="text"
          value={newSuggestionText}
          onChange={(e) => setNewSuggestionText(e.target.value)}
          placeholder="New suggestion text"
          className="rounded-md bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring-blue-500 md:col-span-2"
        />
        <select
          value={newSuggestionStyle}
          onChange={(e) => setNewSuggestionStyle(e.target.value as any)}
          className="rounded-md bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring-blue-500"
        >
          <option>Sentence Starter</option>
          <option>Complete Phrase</option>
        </select>
        <button type="submit" className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 md:col-span-3">
          Add Suggestion
        </button>
      </form>
      
      <div className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((sug) => (
            <div key={sug.id} className="flex items-center justify-between rounded-md bg-gray-700 p-4">
              <div>
                <span className="text-lg">{sug.text}</span>
                <span className="ml-4 rounded-full bg-gray-600 px-2 py-1 text-xs">{sug.style}</span>
              </div>
              <button onClick={() => handleDeleteSuggestion(sug.id)} className="text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No quick suggestions created yet.</p>
        )}
      </div>
    </div>
  );
}
