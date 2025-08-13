
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }
  }, [navigate, isAuthenticated, isLoading]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
          <img src="https://ik.imagekit.io/spmcumfu9/coral.jpeg" alt="CORAL" className="w-full h-full object-cover" />
        </div>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white">Loading CORAL...</span>
      </div>
    </div>
  );
};

export default Index;
