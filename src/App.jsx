import { useState, lazy, Suspense, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { getCurrentUser, logoutUser, isAuthenticated } from './utils/storage';
import { useAppState, useAppActions } from './context/AppContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Shipments = lazy(() => import('./pages/Shipments'));
const Profile = lazy(() => import('./pages/Profile'));
const Customers = lazy(() => import('./pages/Customers'));
const Help = lazy(() => import('./pages/Help'));

export default function App() {
  const state = useAppState();
  const actions = useAppActions();
  const user = state?.user ? state.user.fullName : null;
  const handleLogout = () => {
    actions && actions.logout && actions.logout();
  };

  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-card">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-textSecondary">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route 
            path="/" 
            element={state.isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={state.isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} 
          />
          <Route
            path="/dashboard"
            element={state.isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
          <Route
            path="/shipments"
            element={state.isAuthenticated ? <Shipments user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
          <Route
            path="/customers"
            element={state.isAuthenticated ? <Customers user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
          <Route
            path="/help"
            element={state.isAuthenticated ? <Help user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={state.isAuthenticated ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

