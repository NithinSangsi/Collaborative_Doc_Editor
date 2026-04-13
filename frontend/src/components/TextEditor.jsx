import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import socket from '../utils/socket';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function TextEditor() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  // State variables
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [isRenamingDocument, setIsRenamingDocument] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Refs for managing timers
  const autoSaveTimer = useRef(null);
  const typingTimer = useRef(null);

  // Fetch document content on mount
  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  // Connect to Socket.IO after fetching document
  useEffect(() => {
    if (document && user) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [document, user]);

  // Initialize Quill editor
  useEffect(() => {
    if (document && !quillRef.current) {
      // Register custom fonts
      const Font = Quill.import('formats/font');
      Font.whitelist = ['serif', 'monospace', 'times-new-roman', 'calibri'];
      Quill.register(Font, true);

      const toolbarOptions = [
        [{ 'font': ['serif', 'monospace', 'times-new-roman', 'calibri'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ];

      quillRef.current = new Quill('#editor', {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        },
        placeholder: 'Start typing your document here...'
      });

      // Set initial content
      if (content) {
        quillRef.current.root.innerHTML = content;
      }

      // Handle text changes
      quillRef.current.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user' && !isRemoteUpdate.current) {
          const newContent = quillRef.current.root.innerHTML;
          handleContentChange({ target: { value: newContent } });
        }
      });
    }
  }, [document]);

  // Update Quill content when receiving from socket
  useEffect(() => {
    if (quillRef.current) {
      socket.on('content-changed', (data) => {
        const currentContent = quillRef.current.root.innerHTML;
        if (currentContent !== data.content) {
          isRemoteUpdate.current = true;
          quillRef.current.root.innerHTML = data.content;
          isRemoteUpdate.current = false;
        }
        setSaveStatus(`Updated by ${data.userName}`);
        setTimeout(() => setSaveStatus(''), 3000);
      });
    }

    return () => {
      socket.off('content-changed');
    };
  }, []);

  // Handle other socket events
  useEffect(() => {
    socket.on('user-joined', (data) => {
      setActiveUsers(data.activeUsers);
      setSaveStatus(data.message);
      setTimeout(() => setSaveStatus(''), 3000);
    });

    socket.on('user-typing-indicator', (data) => {
      setTypingUsers((prev) =>
        prev.includes(data.userName) ? prev : [...prev, data.userName]
      );
    });

    socket.on('user-stop-typing-indicator', (data) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.userName));
    });

    socket.on('document-saved-notification', (data) => {
      setSaveStatus(data.message);
      setTimeout(() => setSaveStatus(''), 3000);
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-typing-indicator');
      socket.off('user-stop-typing-indicator');
      socket.off('document-saved-notification');
    };
  }, []);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/documents/${documentId}`);
      setDocument(response.data.document);
      setContent(response.data.document.content);
      setDocumentName(response.data.document.name);
      setError('');
      // Quill will be initialized in useEffect
    } catch (err) {
      setError('Failed to load document');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = () => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join-document', {
      documentId,
      userName: user.name,
    });
  };

  const disconnectSocket = () => {
    if (socket.connected) {
      socket.emit('user-stop-typing', {
        documentId,
        userName: user.name,
      });
      socket.disconnect();
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Emit typing indicator
    socket.emit('user-typing', {
      documentId,
      userName: user.name,
    });

    // Clear previous typing timer
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    // Set new typing timer
    typingTimer.current = setTimeout(() => {
      socket.emit('user-stop-typing', {
        documentId,
        userName: user.name,
      });
    }, 1000);

    // Broadcast content change
    socket.emit('document-update', {
      documentId,
      content: newContent,
      userName: user.name,
    });

    // Auto-save with debounce
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      autoSaveDocument(newContent);
    }, 3000); // Auto-save after 3 seconds of inactivity
  };

  const autoSaveDocument = async (content) => {
    try {
      await api.put(`/documents/${documentId}/save`, {
        content,
        isManualSave: false,
      });
      setSaveStatus('Auto-saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.log('Auto-save failed:', err);
    }
  };

  const handleManualSave = async () => {
    try {
      setIsSaving(true);
      const currentContent = quillRef.current ? quillRef.current.root.innerHTML : content;
      await api.put(`/documents/${documentId}/save`, {
        content: currentContent,
        isManualSave: true,
      });
      socket.emit('document-saved', {
        documentId,
        content: currentContent,
        userName: user.name,
      });
      setSaveStatus('Saved successfully');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('Failed to save');
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenameDocument = async () => {
    if (!newDocumentName.trim()) return;

    try {
      await api.put(`/documents/${documentId}/rename`, {
        name: newDocumentName,
      });
      setDocumentName(newDocumentName);
      setIsRenamingDocument(false);
      setSaveStatus('Document renamed');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setSaveStatus('Failed to rename');
    }
  };

  const handleDeleteDocument = async () => {
    if (!window.confirm('Delete this document permanently?')) return;

    try {
      await api.delete(`/documents/${documentId}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <style>
        {`
          .ql-font-serif { font-family: serif; }
          .ql-font-monospace { font-family: monospace; }
          .ql-font-times-new-roman { font-family: 'Times New Roman', serif; }
          .ql-font-calibri { font-family: Calibri, sans-serif; }
        `}
      </style>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          {/* Top Row - Title & Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition"
                title="Back to Dashboard"
              >
                ← Dashboard
              </button>

              {/* Document Title */}
              {isRenamingDocument ? (
                <div className="flex gap-2 flex-1">
                  <input
                    autoFocus
                    type="text"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                    className="flex-1 px-3 py-1 border border-blue-600 rounded focus:outline-none"
                  />
                  <button
                    onClick={handleRenameDocument}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsRenamingDocument(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <h1
                  onClick={() => {
                    setIsRenamingDocument(true);
                    setNewDocumentName(documentName);
                  }}
                  className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition"
                >
                  {documentName}
                </h1>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Save Status */}
              {saveStatus && (
                <span className="text-sm text-green-600 font-semibold">
                  ✓ {saveStatus}
                </span>
              )}

              {/* Save Button */}
              <button
                onClick={handleManualSave}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDeleteDocument}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Bottom Row - User Info & Typing Indicator */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <p>
                <strong>You:</strong> {user?.name}
              </p>
              {activeUsers.length > 1 && (
                <p className="text-blue-600">
                  📝 {activeUsers.filter((u) => u !== user?.name).join(', ')} is editing
                </p>
              )}
              {typingUsers.length > 0 && (
                <p className="text-orange-600">
                  ✍️ {typingUsers.join(', ')} is typing...
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div id="editor" className="flex-1 p-6 text-lg font-serif min-h-0"></div>
    </div>
  );
}
