import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/index';
import AboutPage from './pages/about';
import FeaturesPage from './pages/features';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import VerifyEmailPage from './pages/auth/verify-email';
import ResetPasswordPage from './pages/auth/reset-password';
import Dashboard from './pages/coming-soon/dashboard';
import ProfilePage from './pages/profile';
import CommentsComingSoon from './pages/coming-soon/comments';
import NotificationsComingSoon from './pages/coming-soon/notifications';
import FundComingSoon from './pages/coming-soon/fund';
import NotFoundPage from './pages/404';
import HomePage from './pages/home';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Components
import PublicRoute from './components/PublicRoute';

// Styles
import './index.css';


function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Pages - Only accessible when not authenticated */}
              <Route path="/" element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } />
              
              {/* Public Pages - Accessible to all */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
              
              {/* Protected Routes - Only accessible when authenticated */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/comments" element={<CommentsComingSoon />} />
              <Route path="/notifications" element={<NotificationsComingSoon />} />
              <Route path="/fund" element={<FundComingSoon />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;