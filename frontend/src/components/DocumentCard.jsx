import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DocumentCard({ document, onDelete }) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-100">
      {/* Document Icon & Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📝</span>
            <h3
              onClick={() => navigate(`/editor/${document._id}`)}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition truncate"
            >
              {document.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            By <span className="font-semibold">{document.ownerName}</span>
          </p>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(document._id)}
          className="text-red-500 hover:text-red-700 transition ml-2"
          title="Delete document"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Metadata */}
      <div className="space-y-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
        <p>Last modified: <strong>{formatDate(document.updatedAt)}</strong></p>
        {document.lastModifiedBy && (
          <p>Modified by: <strong>{document.lastModifiedBy}</strong></p>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate(`/editor/${document._id}`)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition"
      >
        Open Document
      </button>
    </div>
  );
}
