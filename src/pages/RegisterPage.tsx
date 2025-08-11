// Register page for Zygo AI Trading Platform
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, ShieldOff, ArrowRight, Phone, Mail, UserPlus } from "lucide-react";
import zygoLogo from "@/assets/zygo-logo.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral_code: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
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
  
  const { register, isAuthenticated } = auth;
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for referral code in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const referralFromUrl = queryParams.get("referral");
    
    if (referralFromUrl) {
      setFormData(prev => ({ ...prev, referral_code: referralFromUrl }));
    }
  }, [location]);
  
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
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
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
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    if (!agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register(
        formData.phone,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.referral_code
      );
      
      if (success) {
        toast({
          title: "Welcome!",
          description: "Account created successfully",
          duration: 1000,
        });
        navigate("/home", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 20% 20%, #3b82f6 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, #8b5cf6 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 30px 30px, 30px 30px',
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-32 left-10 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-xl animate-ping" style={{animationDuration: '5s'}}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 left-1/5 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-3 py-4 flex flex-col max-w-sm mx-auto w-full">
        {/* Welcome Header */}
        <div className="mb-4 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur-none transition-all duration-500"></div>
          <div className="relative bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-1 truncate">
                  Create Account
                </h1>
                <p className="text-emerald-300 text-sm truncate font-medium">Join Zygo AI Trading</p>
              </div>
              
              {/* Enhanced Zygo Logo */}
              <div className="relative flex-shrink-0 ml-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                  <img src={zygoLogo} alt="Zygo" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Register Form */}
        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-white/5 rounded-xl blur-sm group-hover:blur-none transition-all duration-500"></div>
          <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-300 mb-4 overflow-hidden">
            {/* Form background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #3b82f6 0.5px, transparent 0.5px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4 relative z-10">
            {/* Phone Field */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-medium text-white">
                Phone Number
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none z-10">
                  <span className="text-xs text-slate-400 border-r border-slate-600 pr-1.5 mr-1.5 whitespace-nowrap">+91</span>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="h-10 pl-10 pr-10 text-sm bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300 w-full"
                  maxLength={10}
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
              {formData.phone && formData.phone.length < 10 && (
                <p className="text-xs text-red-400">Please enter 10 digits</p>
              )}
            </div>
            
            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium text-white">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="h-10 pl-3 pr-10 text-sm bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300 w-full"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-medium text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className="h-10 pl-3 pr-10 text-sm bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300 w-full"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500 hover:text-white transition-colors touch-manipulation"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Confirm Password Field */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-white">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="h-10 pl-3 pr-10 text-sm bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300 w-full"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            </div>
            
            {/* Referral Code Field */}
            <div className="space-y-1">
              <Label htmlFor="referral_code" className="text-xs font-medium text-white">
                Referral Code <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </Label>
              <Input
                id="referral_code"
                name="referral_code"
                type="text"
                value={formData.referral_code}
                onChange={handleChange}
                placeholder="Enter referral code"
                className="h-10 pl-3 pr-3 text-sm bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300 w-full"
              />
            </div>
            
            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2 pt-1">
              <Checkbox 
                id="terms" 
                checked={agreeTerms} 
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-0.5 flex-shrink-0"
              />
              <label
                htmlFor="terms"
                className="text-xs text-slate-400 leading-relaxed"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-blue-400 hover:text-blue-300 font-medium transition-colors touch-manipulation">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300 font-medium transition-colors touch-manipulation">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0 mt-4 touch-manipulation"
              disabled={!agreeTerms || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </div>
              )}
            </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors touch-manipulation">
                  Sign In
                </Link>
              </p>
              
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-blue-400 hover:underline transition-colors touch-manipulation">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-400 hover:underline transition-colors touch-manipulation">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;