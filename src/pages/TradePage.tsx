
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TradePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Trading</h1>
        <div></div>
      </div>
      
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Trading Platform</h2>
          <p className="text-gray-400">Trading interface coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default TradePage;
