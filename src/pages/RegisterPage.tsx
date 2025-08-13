
// Register page for CORAL Trading Platform
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Smartphone, AtSign, Lock, UserPlus, User } from "lucide-react";
import coralLogo from "@/assets/coral-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen bg-slate-900 flex flex-col p-4" style={{backgroundColor: '#1a2332'}}>
      {/* Header Section */}
      <div className="mb-6 mt-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Hello</h1>
              <p className="text-emerald-400 text-sm">Welcome to CORAL</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <img src={coralLogo} alt="CORAL" className="w-8 h-8 object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/30">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Join CORAL Trading Platform</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Phone Number Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Phone Number</span>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                <span className="text-slate-400 text-sm border-r border-slate-600 pr-3 mr-3">+91</span>
              </div>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="h-14 pl-16 bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl text-white placeholder:text-slate-400 text-base"
                maxLength={10}
                required
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <AtSign className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Email Address</span>
            </div>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="h-14 bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl text-white placeholder:text-slate-400 text-base"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Password</span>
            </div>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="h-14 pr-12 bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl text-white placeholder:text-slate-400 text-base"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Referral Code Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Referral Code</span>
              <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-lg">Optional</span>
            </div>
            <Input
              name="referral_code"
              type="text"
              value={formData.referral_code}
              onChange={handleChange}
              placeholder="Enter referral code"
              className="h-14 bg-slate-700/50 border-slate-600 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl text-white placeholder:text-slate-400 text-base"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 py-2">
            <Checkbox 
              id="terms" 
              checked={agreeTerms} 
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
              I agree to the{" "}
              <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg mt-8"
            disabled={!agreeTerms || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </div>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center space-y-4">
          <p className="text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign In
            </Link>
          </p>
          
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-blue-400 hover:underline">
              Terms
            </Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
