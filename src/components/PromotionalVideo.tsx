
import { Play } from "lucide-react";

const PromotionalVideo = () => {
  return (
    <div className="px-4 mb-6">
      <h3 className="text-gray-300 font-medium mb-3">Promotional Video</h3>
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 h-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-between h-full p-4">
          <div className="text-white">
            <h4 className="text-lg font-bold mb-1">QUANTUM LEAP</h4>
            <p className="text-sm opacity-90">Trading Revolution</p>
          </div>
          <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-6 h-6 text-white ml-1" />
          </button>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-2 right-8 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 right-12 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default PromotionalVideo;
