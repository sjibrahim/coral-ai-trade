
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Shield, TrendingUp, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading Trexo...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/3 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/2 to-transparent rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header with logo and branding */}
        <div className="text-center mb-8 animate-fade-in-scale">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/70 rounded-3xl flex items-center justify-center shadow-2xl border border-primary/20 animate-pulse-ring">
            <img 
              src="https://ik.imagekit.io/spmcumfu9/trexo.jpeg" 
              alt="Trexo Logo" 
              className="w-14 h-14 rounded-2xl object-cover"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-primary bg-clip-text text-transparent mb-3 tracking-tight">
            Trexo
          </h1>
          <p className="text-slate-600 text-lg font-medium max-w-md mx-auto leading-relaxed">
            Professional Trading Platform
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-primary/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <TrendingUp className="w-4 h-4" />
              <span>Live Trading</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-primary/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Shield className="w-4 h-4" />
              <span>Bank-Grade Security</span>
            </div>
          </div>
        </div>

        {/* Login form card */}
        <div className="w-full max-w-md animate-slide-in-up">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Sign In to Your Account
              </h2>
              <p className="text-slate-600 font-medium">
                Access your trading dashboard
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Phone number field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="phone" 
                  className="text-sm font-bold text-slate-900 flex items-center gap-2"
                >
                  Phone Number
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative group">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="h-14 pl-4 pr-12 text-base font-medium border-2 border-slate-200 bg-white/90 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 rounded-2xl hover:border-slate-300 group-hover:shadow-lg"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <Smartphone className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              {/* Password field */}
              <div className="space-y-3">
                <Label 
                  htmlFor="password" 
                  className="text-sm font-bold text-slate-900 flex items-center gap-2"
                >
                  Password
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-14 pl-4 pr-12 text-base font-medium border-2 border-slate-200 bg-white/90 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 rounded-2xl hover:border-slate-300 group-hover:shadow-lg"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-14 text-base font-bold rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mt-8 group"
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
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </Button>
            </form>
          </div>
          
          {/* Register link */}
          <div className="text-center mt-8">
            <p className="text-slate-600 font-medium">
              New to Trexo?{" "}
              <Link 
                to="/register" 
                className="text-primary hover:text-primary/80 font-bold hover:underline transition-all duration-300 inline-flex items-center gap-1 group"
              >
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </p>
          </div>
          
          {/* Additional info */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 mt-6 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline font-semibold">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline font-semibold">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
