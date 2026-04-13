import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateDocument from './pages/CreateDocument';
import TextEditor from './components/TextEditor';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateDocument />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor/:documentId"
            element={
              <ProtectedRoute>
                <TextEditor />
              </ProtectedRoute>
            }
          />

          {/* Redirect to login by default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
