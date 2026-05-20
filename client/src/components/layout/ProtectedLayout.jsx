import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 lg:ml-64">
        <Navbar />
        <main className="flex-1 pb-24 pt-6 lg:pb-8 lg:pt-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
