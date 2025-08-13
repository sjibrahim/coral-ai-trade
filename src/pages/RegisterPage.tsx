
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock, Gift, Sparkles, ArrowRight, Shield, Zap, Star } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Loading...</p>
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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Unique Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-12 left-8 w-24 h-24 bg-emerald-400/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-12 w-16 h-16 bg-violet-400/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-16 w-20 h-20 bg-orange-400/10 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-8 w-28 h-28 bg-pink-400/10 rounded-full animate-pulse delay-700"></div>
        </div>
        
        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-emerald-400 rotate-45 rounded-lg"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-violet-400 rotate-12 rounded-lg"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col px-4 py-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl p-1 shadow-lg shadow-emerald-500/25">
                <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
                  <img src={coralLogo} alt="CORAL" className="w-12 h-12 object-cover rounded-2xl" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-slate-950" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">CORAL</span>
          </h1>
          <p className="text-slate-400 text-lg">Start your trading journey today</p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-slate-300">Fast</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-slate-300">Trusted</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 shadow-2xl">
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Phone Input */}
              <div className="space-y-3">
                <Label className="text-slate-200 text-sm font-medium flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center">
                    <Phone className="w-3 h-3 text-slate-950" />
                  </div>
                  Phone Number
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                      <span className="text-slate-400 text-sm bg-slate-800 px-2 py-1 rounded-lg mr-3">+91</span>
                    </div>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="h-14 pl-20 pr-4 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-2xl focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-3">
                <Label className="text-slate-200 text-sm font-medium flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-violet-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <Mail className="w-3 h-3 text-slate-950" />
                  </div>
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      className="h-14 px-4 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-2xl focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <Label className="text-slate-200 text-sm font-medium flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                    <Lock className="w-3 h-3 text-slate-950" />
                  </div>
                  Create Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a secure password"
                      className="h-14 px-4 pr-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-2xl focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-orange-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Referral Code Input */}
              <div className="space-y-3">
                <Label className="text-slate-200 text-sm font-medium flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
                    <Gift className="w-3 h-3 text-slate-950" />
                  </div>
                  Referral Code
                  <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-slate-950 text-xs px-2 py-1 rounded-full font-medium">Optional</span>
                </Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                  <div className="relative">
                    <Input
                      name="referral_code"
                      type="text"
                      value={formData.referral_code}
                      onChange={handleChange}
                      placeholder="Enter referral code (optional)"
                      className="h-14 px-4 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-2xl focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-1 border-slate-600 data-[state=checked]:bg-emerald-400 data-[state=checked]:border-emerald-400 rounded-lg"
                />
                <label htmlFor="terms" className="text-sm text-slate-400 leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-medium">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!agreeTerms || isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-slate-950 font-semibold rounded-2xl shadow-lg hover:shadow-emerald-400/25 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed border-0"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    Create My Account
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-800/50 text-center space-y-4">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2">
                  Sign in here
                </Link>
              </p>
              
              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>ISO Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
