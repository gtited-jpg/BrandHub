import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// Fix: Added .tsx extension for module resolution.
import { AuthProvider } from './context/AuthContext.tsx';

// Fix: Added .tsx extension for module resolution.
import MainLayout from './components/layout/MainLayout.tsx';
// Fix: Added .tsx extension for module resolution.
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

// Fix: Added .tsx extension for module resolution.
import HomePage from './components/pages/HomePage.tsx';
// Fix: Added .tsx extension for module resolution.
import LoginPage from './components/pages/LoginPage.tsx';
// Fix: Added .tsx extension for module resolution.
import SignupPage from './components/pages/SignupPage.tsx';
// Fix: Added .tsx extension for module resolution.
import DashboardPage from './components/pages/DashboardPage.tsx';
// Fix: Added .tsx extension for module resolution.
import BrandDetailPage from './components/pages/dashboard/BrandDetailPage.tsx';
// Fix: Added .tsx extension for module resolution.
import LaunchCalendarPage from './components/pages/LaunchCalendarPage.tsx';
// Fix: Added .tsx extension for module resolution.
import PricingPage from './components/pages/PricingPage.tsx';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/brand/:brandId"
              element={
                <ProtectedRoute>
                  <BrandDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/launches"
              element={
                <ProtectedRoute>
                  <LaunchCalendarPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;