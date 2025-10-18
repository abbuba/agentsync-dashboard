// src/components/AnalyticsDashboard.tsx

"use client";

import { useState } from 'react';
import axios from 'axios';

interface AnalyticsDashboardProps {
  organizationId: number;
}

export default function AnalyticsDashboard({ organizationId }: AnalyticsDashboardProps) {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    setReport('');

    try {
      const response = await axios.get(`${apiUrl}/organizations/${organizationId}/ai-strategic-report`);
      setReport(response.data.analysis);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'Failed to generate report.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <h3 className="mb-4 text-2xl font-semibold">AI Strategic Analysis</h3>
      
      <div className="mb-6">
        <p className="mb-4 text-gray-400">
          Click the button below to generate a comprehensive strategic report based on all feedback submitted for your organization. The AI will provide an executive summary, identify recurring themes, and suggest actionable improvements.
        </p>
        <button 
          onClick={handleGenerateReport}
          disabled={loading}
          className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
        >
          {loading ? 'Generating Report...' : 'Generate Overall Strategic Report'}
        </button>
      </div>

      {error && <p className="text-red-400">{error}</p>}

      {report && (
        <div className="mt-6 rounded-md border border-gray-700 bg-gray-900/50 p-6">
          <h4 className="mb-4 text-xl font-bold">Generated Report</h4>
          {/* Use pre-wrap to respect newlines and formatting from the AI response */}
          <p className="whitespace-pre-wrap font-mono leading-relaxed text-gray-300">
            {report}
          </p>
        </div>
      )}
    </div>
  );
}
