// Register page for CORAL Trading Platform
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Smartphone, AtSign, UserPlus } from "lucide-react";
import coralLogo from "@/assets/coral-logo.png";
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
    
    if (!formData.phone || !formData.email || !formData.password) {
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
        formData.password,
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
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{backgroundColor: '#0f1526'}}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #3b82f6 2px, transparent 2px),
                             radial-gradient(circle at 80% 80%, #8b5cf6 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="absolute top-10 right-5 w-20 h-20 bg-blue-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-5 w-24 h-24 bg-purple-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-3 py-4 flex flex-col max-w-sm mx-auto w-full">
        {/* Welcome Header */}
        <div className="mb-4 bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-blue-500/15 backdrop-blur-xl rounded-xl p-3 border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white mb-1 truncate">Hello</h1>
              <p className="text-emerald-300 text-xs truncate">Welcome to CORAL</p>
            </div>
            
            {/* CORAL Logo */}
            <div className="relative flex-shrink-0 ml-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                <img src={coralLogo} alt="CORAL" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className="flex-1 bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-4 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-slate-400 text-sm">Join CORAL Trading Platform</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                Phone Number
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                  <span className="text-sm text-slate-400 border-r border-slate-600/50 pr-3 mr-3 font-medium">+91</span>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="h-14 pl-16 pr-4 text-base bg-white/5 border-2 border-white/10 focus:border-blue-400/50 focus:bg-white/10 rounded-xl text-white placeholder:text-slate-500 transition-all duration-300 w-full group-hover:border-white/20 backdrop-blur-sm"
                  maxLength={10}
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {formData.phone && formData.phone.length < 10 && (
                <div className="flex items-center gap-2 text-xs text-red-400 animate-fade-in">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  Please enter 10 digits
                </div>
              )}
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                <AtSign className="w-4 h-4 text-blue-400" />
                Email Address
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="h-14 pl-4 pr-4 text-base bg-white/5 border-2 border-white/10 focus:border-blue-400/50 focus:bg-white/10 rounded-xl text-white placeholder:text-slate-500 transition-all duration-300 w-full group-hover:border-white/20 backdrop-blur-sm"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                Password
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="h-14 pl-4 pr-14 text-base bg-white/5 border-2 border-white/10 focus:border-blue-400/50 focus:bg-white/10 rounded-xl text-white placeholder:text-slate-500 transition-all duration-300 w-full group-hover:border-white/20 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-all duration-200 touch-manipulation hover:scale-110"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Referral Code Field */}
            <div className="space-y-2">
              <Label htmlFor="referral_code" className="text-sm font-medium text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Referral Code 
                <span className="text-xs text-slate-500 font-normal bg-slate-800/50 px-2 py-0.5 rounded-full">Optional</span>
              </Label>
              <div className="relative group">
                <Input
                  id="referral_code"
                  name="referral_code"
                  type="text"
                  value={formData.referral_code}
                  onChange={handleChange}
                  placeholder="Enter referral code"
                  className="h-14 pl-4 pr-4 text-base bg-white/5 border-2 border-white/10 focus:border-blue-400/50 focus:bg-white/10 rounded-xl text-white placeholder:text-slate-500 transition-all duration-300 w-full group-hover:border-white/20 backdrop-blur-sm"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
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
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 mt-6 touch-manipulation hover:scale-[1.02]"
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
  );
};

export default RegisterPage;