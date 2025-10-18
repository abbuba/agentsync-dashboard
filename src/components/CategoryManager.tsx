// src/components/CategoryManager.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the shape of our data
interface Topic {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
  organization_id: number;
  topics: Topic[]; // A category will now hold its topics
}
interface CategoryManagerProps {
  organizationId: number;
}

export default function CategoryManager({ organizationId }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // --- Category Functions ---
  const fetchCategories = async () => {
    // We will now fetch categories and their associated topics together
    try {
      const response = await axios.get(`${apiUrl}/organizations/${organizationId}/categories`);
      // Fetch topics for each category
      const categoriesWithTopics = await Promise.all(response.data.map(async (cat: Category) => {
        const topicsResponse = await axios.get(`${apiUrl}/categories/${cat.id}/topics`);
        return { ...cat, topics: topicsResponse.data };
      }));
      setCategories(categoriesWithTopics);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [organizationId]);
  
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const response = await axios.post(`${apiUrl}/organizations/${organizationId}/categories`, { name: newCategoryName });
      setCategories([...categories, { ...response.data, topics: [] }]);
      setNewCategoryName('');
    } catch (err) {
      setError('Failed to add category.');
    }
  };
  
  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure? This will delete the category and all its topics.')) return;
    try {
      await axios.delete(`${apiUrl}/categories/${categoryId}`);
      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (err) {
      setError('Failed to delete category.');
    }
  };

  // --- Topic Functions ---
  const handleAddTopic = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTopicName.trim() || !selectedCategoryId) return;
      try {
          const response = await axios.post(`${apiUrl}/categories/${selectedCategoryId}/topics`, { name: newTopicName });
          // Update the state to include the new topic
          const updatedCategories = categories.map(cat => 
              cat.id === selectedCategoryId 
                  ? { ...cat, topics: [...cat.topics, response.data] }
                  : cat
          );
          setCategories(updatedCategories);
          setNewTopicName('');
      } catch (err) {
          setError('Failed to add topic.');
      }
  };

  const handleDeleteTopic = async (topicId: number) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    try {
        await axios.delete(`${apiUrl}/topics/${topicId}`);
        // Update the state to remove the topic
        const updatedCategories = categories.map(cat => {
            if (cat.id === selectedCategoryId) {
                return { ...cat, topics: cat.topics.filter(topic => topic.id !== topicId) };
            }
            return cat;
        });
        setCategories(updatedCategories);
    } catch (err) {
        setError('Failed to delete topic.');
    }
  };


  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Categories Panel */}
      <div className="rounded-lg bg-gray-800 p-6">
        <h3 className="mb-4 text-2xl font-semibold">Manage Categories</h3>
        <form onSubmit={handleAddCategory} className="mb-6 flex gap-4">
          <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" className="flex-grow rounded-md bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring-blue-500" />
          <button type="submit" className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">Add</button>
        </form>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} onClick={() => setSelectedCategoryId(category.id)} 
                 className={`cursor-pointer rounded-md p-4 transition ${selectedCategoryId === category.id ? 'bg-blue-900/50 ring-2 ring-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
              <div className="flex items-center justify-between">
                <span className="text-lg">{category.name}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }} className="text-red-500 hover:text-red-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Panel */}
      <div className="rounded-lg bg-gray-800 p-6">
        <h3 className="mb-4 text-2xl font-semibold">Manage Topics</h3>
        {selectedCategoryId ? (
          <div>
            <form onSubmit={handleAddTopic} className="mb-6 flex gap-4">
                <input type="text" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} placeholder="New topic name" className="flex-grow rounded-md bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring-blue-500"/>
                <button type="submit" className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">Add</button>
            </form>
            <div className="space-y-3">
              {categories.find(c => c.id === selectedCategoryId)?.topics.map(topic => (
                <div key={topic.id} className="flex items-center justify-between rounded-md bg-gray-700 p-4">
                    <span className="text-lg">{topic.name}</span>
                    <button onClick={() => handleDeleteTopic(topic.id)} className="text-red-500 hover:text-red-400">Delete</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-16 text-center text-gray-500">Select a category to manage its topics.</p>
        )}
      </div>
      {error && <div className="text-red-400 md:col-span-2">{error}</div>}
    </div>
  );
}
