
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context not available:", error);
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
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
          title: "Welcome back!",
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-300/10 to-emerald-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-emerald-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-green-300/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-64 right-12 w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="pt-16 pb-8 px-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl animate-fade-in-scale">
            <img 
              src="https://ik.imagekit.io/spmcumfu9/trexo.jpeg" 
              alt="Trexo Logo" 
              className="w-12 h-12 rounded-2xl object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 animate-slide-in-up">
            Trexo
          </h1>
          <p className="text-muted-foreground text-lg animate-slide-in-up delay-200">
            Your crypto trading companion
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in-scale">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Phone Field */}
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative group">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="h-14 pl-4 pr-12 text-base bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300 group-hover:shadow-md focus:shadow-lg"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-14 pl-4 pr-12 text-base bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300 group-hover:shadow-md focus:shadow-lg"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-green-500 transition-colors duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex-shrink-0 p-6 text-center space-y-4">
          <p className="text-gray-600">
            New to Trexo?{" "}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-300">
              Create Account
            </Link>
          </p>
          
          <p className="text-xs text-gray-500 leading-relaxed px-4">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-green-600 hover:underline transition-colors duration-300">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-green-600 hover:underline transition-colors duration-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
