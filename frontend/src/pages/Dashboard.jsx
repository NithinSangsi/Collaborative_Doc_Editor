import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DocumentCard from '../components/DocumentCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents/all');
      setDocuments(response.data.documents);
      setError('');
    } catch (err) {
      setError('Failed to load documents');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await api.delete(`/documents/${docId}`);
      setDocuments(documents.filter((doc) => doc._id !== docId));
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">DocEdit</h1>
          <div className="flex items-center gap-6">
            <span className="text-gray-700">Welcome, <strong>{user?.name}</strong></span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">My Documents</h2>
            <p className="text-gray-600">Create and manage your collaborative documents</p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition shadow-lg"
          >
            + Create New Document
          </button>
        </div>

        {/* Loading State or Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to load documents</h3>
            <p className="text-gray-600 mb-6">
              Please check your connection and try again
            </p>
            <button
              onClick={fetchDocuments}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Retry
            </button>
          </div>
        ) : documents.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first document and start collaborating with others
            </p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Create Your First Document
            </button>
          </div>
        ) : (
          // Documents Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
