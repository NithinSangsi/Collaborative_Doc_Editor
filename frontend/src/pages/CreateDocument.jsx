import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function CreateDocument() {
  const navigate = useNavigate();
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setError('');

    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/documents/create', {
        name: documentName,
      });

      // Navigate to editor with the new document ID
      navigate(`/editor/${response.data.document._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Create New Document</h1>
          <p className="text-gray-600">Give your document a name to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreateDocument}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Document Name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g., Project Proposal, Meeting Notes"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
              autoFocus
            />
            <p className="text-gray-500 text-sm mt-2">
              You can rename this document later
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-2 rounded font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Document'}
            </button>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
