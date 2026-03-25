import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Result from './pages/Result';
import Chatbot from './pages/Chatbot';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Navbar from './components/layout/Navbar';

// Protect routes component wrapping layout
const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

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
            <Upload />
          </ProtectedLayout>
        } />
        
        <Route path="/result/:id" element={
          <ProtectedLayout>
            <Result />
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;