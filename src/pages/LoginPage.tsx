
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Smartphone, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
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
    
    // For phone number, only allow digits and limit to 10
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
      return;
    }
    
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
    
    if (formData.phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/5 to-emerald-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Banner - Dark teal style */}
        <header className="px-4 sm:px-6 pt-6 pb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-2xl">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            </div>
            <div className="flex items-center justify-between px-4 sm:px-6 py-6 relative z-10">
              <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center">
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>Hello</h2>
                <p className="text-white/80 text-xs sm:text-sm">Welcome to Trexo</p>
              </div>
              <div className="w-9" />
            </div>
          </div>
        </header>

        {/* Login Form - Responsive positioning and sizing */}
        <div className="flex-1 px-4 sm:px-6 flex items-start justify-center pt-2 sm:pt-4">
          <div className="w-full max-w-sm">
            <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-700/50 animate-fade-in-scale text-white">
                <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-white mb-2`}>Login</h3>
                {/* Phone Field with Indian Country Code */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold text-white">
                    Phone Number
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
                      <span className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-400 border-r border-gray-600 pr-2 sm:pr-3 mr-2 sm:mr-3`}>+44</span>
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={`${isMobile ? 'h-12 pl-14 pr-10 text-base' : 'h-14 pl-16 pr-12 text-base'} bg-gray-700/50 border border-gray-600 focus:border-primary focus:bg-gray-700/70 rounded-xl transition-all duration-300 text-white placeholder:text-gray-400 group-hover:shadow-md focus:shadow-lg`}
                      maxLength={10}
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <div className={`absolute inset-y-0 right-0 flex items-center ${isMobile ? 'pr-3' : 'pr-4'} pointer-events-none`}>
                      <Smartphone className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400 group-hover:text-white transition-colors duration-300`} />
                    </div>
                  </div>
                  {formData.phone && formData.phone.length < 10 && (
                    <p className="text-xs text-red-500 ml-1">Please enter 10 digits</p>
                  )}
                </div>
                
                {/* Password Field */}
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-white">
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your secure password"
                      className={`${isMobile ? 'h-12 pl-3 pr-10 text-base' : 'h-14 pl-4 pr-12 text-base'} bg-gray-700/50 border border-gray-600 focus:border-primary focus:bg-gray-700/70 rounded-xl transition-all duration-300 text-white placeholder:text-gray-400 group-hover:shadow-md focus:shadow-lg`}
                      required
                    />
                    <button
                      type="button"
                      className={`absolute inset-y-0 right-0 flex items-center ${isMobile ? 'pr-3' : 'pr-4'} text-gray-400 hover:text-white transition-colors duration-300`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} /> : <Eye className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />}
                    </button>
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className={`w-full ${isMobile ? 'h-12 text-base' : 'h-14 text-base'} font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <LogIn className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Footer - Responsive spacing */}
        <div className={`flex-shrink-0 ${isMobile ? 'p-4' : 'p-6'} text-center space-y-3 sm:space-y-4`}>
          <p className={`text-gray-400 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors duration-300">
              Register now
            </Link>
          </p>
          
          <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 leading-relaxed px-2 sm:px-4`}>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline transition-colors duration-300">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline transition-colors duration-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
