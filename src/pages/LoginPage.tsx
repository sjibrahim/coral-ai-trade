
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Wrap the useAuth hook in a try-catch to handle the case when AuthProvider is not available
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context not available:", error);
    return (
      <div className="flex flex-col min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-green-50/30 p-6 items-center justify-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse-ring">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-muted-foreground animate-fade-in-scale">Loading Trexo...</p>
      </div>
    );
  }
  
  const { login, isAuthenticated } = auth;
  const navigate = useNavigate();
  
  if (isAuthenticated) {
    setTimeout(() => navigate("/home", { replace: true }), 0);
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(formData.phone, formData.password);
      
      if (success) {
        toast({
          title: "Welcome to Trexo!",
          description: "Login successful",
          duration: 1000,
        });
        
        navigate("/home", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10">
        {/* Logo and Brand Section */}
        <div className="text-center mb-8 animate-fade-in-scale">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/50 animate-pulse-ring">
            <img 
              src="https://ik.imagekit.io/spmcumfu9/trexo.jpeg" 
              alt="Trexo Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-gradient-trexo mb-2">
            Trexo
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Professional Trading Platform
          </p>
          <div className="flex justify-center items-center gap-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Live Markets</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-green-500" />
              <span>Fast</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="max-w-sm mx-auto w-full">
          <div className="card-modern p-8 animate-slide-in-up">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Welcome Back
            </h2>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2 animate-slide-in-left">
                <label className="text-sm font-semibold text-gray-700 block" htmlFor="phone">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="input-modern h-12 w-full"
                  required
                />
              </div>
              
              <div className="space-y-2 animate-slide-in-right">
                <label className="text-sm font-semibold text-gray-700 block" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="input-modern h-12 w-full pr-12"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-12 px-3 text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="btn-primary-modern w-full h-12 text-base mt-6 animate-slide-in-up"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
          
          {/* Register Link */}
          <div className="text-center mt-6 animate-fade-in-scale">
            <p className="text-gray-600">
              New to Trexo?{" "}
              <Link 
                to="/register" 
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center py-6 animate-fade-in-scale">
        <p className="text-xs text-gray-500">
          &copy; 2025 Trexo. Empowering traders worldwide.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
