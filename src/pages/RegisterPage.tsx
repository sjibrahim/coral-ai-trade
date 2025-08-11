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
      <div className="relative z-10 flex-1 px-4 py-6 flex flex-col">
        {/* Welcome Header */}
        <div className="mb-6 bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-blue-500/15 backdrop-blur-xl rounded-xl p-4 border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-1">Hello</h1>
              <p className="text-emerald-300 text-xs">Welcome to Zygo AI</p>
            </div>
            
            {/* AI Bot Visual */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center relative">
                <div className="relative">
                  <div className="w-6 h-6 bg-white/20 rounded-md mb-0.5"></div>
                  <div className="flex gap-0.5 justify-center">
                    <div className="w-1 h-1 bg-emerald-300 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-emerald-300 rounded-full animate-pulse delay-100"></div>
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent rounded-full opacity-60 animate-pulse"></div>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
              <img src={zygoLogo} alt="Zygo" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-slate-400 text-xs">AI Trading Platform</p>
        </div>

        {/* Register Form */}
        <div className="flex-1 bg-white/[0.02] backdrop-blur-xl rounded-xl p-5 border border-white/10 mb-4">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-medium text-white">
                Phone Number
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-xs text-slate-400 border-r border-slate-600 pr-2 mr-2">+91</span>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="h-12 pl-12 pr-12 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300"
                  maxLength={10}
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-500" />
                </div>
              </div>
              {formData.phone && formData.phone.length < 10 && (
                <p className="text-xs text-red-400">Please enter 10 digits</p>
              )}
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
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
                  className="h-12 pl-4 pr-12 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
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
                  className="h-12 pl-4 pr-12 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white transition-colors touch-manipulation"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Confirm Password Field */}
            <div className="space-y-2">
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
                  className="h-12 pl-4 pr-12 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Shield className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
            
            {/* Referral Code Field */}
            <div className="space-y-2">
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
                className="h-12 pl-4 pr-4 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-500 transition-all duration-300"
              />
            </div>
            
            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={agreeTerms} 
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-400 leading-relaxed"
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
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0 mt-6 touch-manipulation"
              disabled={!agreeTerms || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5" />
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