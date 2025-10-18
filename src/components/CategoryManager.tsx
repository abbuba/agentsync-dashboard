// src/components/CategoryManager.tsx

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the shape of our Category data
interface Category {
  id: number;
  name: string;
  organization_id: number;
}

// Define the props our component will accept
interface CategoryManagerProps {
  organizationId: number;
}

export default function CategoryManager({ organizationId }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Function to fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/organizations/${organizationId}/categories`);
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories when the component first loads
  useEffect(() => {
    fetchCategories();
  }, [organizationId]);

  // Function to handle adding a new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const response = await axios.post(`${apiUrl}/organizations/${organizationId}/categories`, {
        name: newCategoryName,
      });
      // Add the new category to our list and refresh
      setCategories([...categories, response.data]);
      setNewCategoryName(''); // Clear the input field
    } catch (err) {
      setError('Failed to add category.');
    }
  };
  
  // Function to handle deleting a category
  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        await axios.delete(`${apiUrl}/categories/${categoryId}`);
        // Filter out the deleted category from our list
        setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (err) {
        setError('Failed to delete category.');
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <h3 className="mb-4 text-2xl font-semibold">Manage Categories</h3>
      
      {/* Form to add a new category */}
      <form onSubmit={handleAddCategory} className="mb-6 flex gap-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="flex-grow rounded-md border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
        />
        <button type="submit" className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
          Add
        </button>
      </form>
      
      {/* List of existing categories */}
      <div className="space-y-3">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-md bg-gray-700 p-4">
              <span className="text-lg">{category.name}</span>
              <button onClick={() => handleDeleteCategory(category.id)} className="text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No categories created yet.</p>
        )}
      </div>
    </div>
  );
}
