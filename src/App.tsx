import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/index';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import ResetPasswordPage from './pages/auth/reset-password';
import DashboardComingSoon from './pages/coming-soon/dashboard';
import ProfileComingSoon from './pages/coming-soon/profile';
import CommentsComingSoon from './pages/coming-soon/comments';
import NotificationsComingSoon from './pages/coming-soon/notifications';
import FundComingSoon from './pages/coming-soon/fund';
import NotFoundPage from './pages/404';

// Styles
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          
          {/* Coming Soon Routes */}
          <Route path="/dashboard" element={<DashboardComingSoon />} />
          <Route path="/profile" element={<ProfileComingSoon />} />
          <Route path="/comments" element={<CommentsComingSoon />} />
          <Route path="/notifications" element={<NotificationsComingSoon />} />
          <Route path="/fund" element={<FundComingSoon />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;