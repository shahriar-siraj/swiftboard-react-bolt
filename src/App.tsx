import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/theme';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/auth';

import LandingPage from './pages/frontend/LandingPage';
import TermsAndConditions from './pages/frontend/TermsAndConditions';
import PrivacyPolicy from './pages/frontend/PrivacyPolicy';
import Dashboard from './pages/Dashboard';
import AllProjects from './pages/AllProjects';
import ArchivedProjects from './pages/ArchivedProjects';
import HelpSupport from './pages/HelpSupport';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Project from './pages/Project';
import NewProject from './pages/NewProject';
import Settings from './pages/Settings';
import Sidebar from "./components/Sidebar.tsx";
import Header from "./components/Header.tsx";
import ScrollToTop from './components/ScrollToTop';
import {cn} from "./lib/utils.ts";

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar/>
      <Header/>
      <main className={cn(
          "transition-all duration-300 pl-0 sm:pl-20"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:mt-0 mt-[30px]">
          {children}
        </div>
      </main>
    </div>
  )
};

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const {setUser, setLoading} = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <AllProjects />
              </ProtectedRoute>
            } />
            <Route path="/archived" element={
              <ProtectedRoute>
                <ArchivedProjects />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <HelpSupport />
              </ProtectedRoute>
            } />
            <Route path="/project/:id" element={
              <ProtectedRoute>
                <Project />
              </ProtectedRoute>
            } />
            <Route path="/new-project" element={
              <ProtectedRoute>
                <NewProject />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;