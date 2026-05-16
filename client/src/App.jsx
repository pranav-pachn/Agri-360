import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedLayout from './components/layout/ProtectedLayout';

import Login from './pages/Login';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CropDiagnosis from './pages/CropDiagnosis';
import Result from './pages/Result';
import TrustScore from './pages/TrustScore';
import Chatbot from './pages/Chatbot';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import PendingApplications from './pages/PendingApplications';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        
        <Route path="/dashboard" element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        } />
        
        <Route path="/upload" element={
          <ProtectedLayout>
            <CropDiagnosis />
          </ProtectedLayout>
        } />

        <Route path="/diagnosis" element={
          <ProtectedLayout>
            <CropDiagnosis />
          </ProtectedLayout>
        } />
        
        <Route path="/result/:id" element={
          <ProtectedLayout>
            <Result />
          </ProtectedLayout>
        } />

        <Route path="/trust-score" element={
          <ProtectedLayout>
            <TrustScore />
          </ProtectedLayout>
        } />
        
        <Route path="/chat" element={
          <ProtectedLayout>
            <Chatbot />
          </ProtectedLayout>
        } />
        
        <Route path="/analytics" element={
          <ProtectedLayout>
            <Analytics />
          </ProtectedLayout>
        } />
        
        <Route path="/profile" element={
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        } />

        <Route path="/applications" element={
          <ProtectedLayout>
            <PendingApplications />
          </ProtectedLayout>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;