
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Mobile-optimized container */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-6">
          
          {/* Logo and Welcome Section */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              <img src={coralLogo} alt="CORAL" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Account</h1>
              <p className="text-slate-300 text-sm mt-1">Join CORAL Trading Platform</p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  Phone Number
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-sm text-slate-400 border-r border-slate-600/50 pr-2 mr-2">+91</span>
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="h-12 pl-16 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-400"
                    maxLength={10}
                    required
                  />
                </div>
                {formData.phone && formData.phone.length < 10 && (
                  <p className="text-xs text-red-400">Please enter 10 digits</p>
                )}
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-blue-400" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="h-12 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-400"
                  required
                />
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
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
                    className="h-12 pr-12 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Referral Code Field */}
              <div className="space-y-2">
                <Label htmlFor="referral_code" className="text-sm font-medium text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  Referral Code
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">Optional</span>
                </Label>
                <Input
                  id="referral_code"
                  name="referral_code"
                  type="text"
                  value={formData.referral_code}
                  onChange={handleChange}
                  placeholder="Enter referral code"
                  className="h-12 text-base bg-white/5 border border-white/20 focus:border-blue-400 focus:bg-white/10 rounded-lg text-white placeholder:text-slate-400"
                />
              </div>
              
              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed flex-1">
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
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg mt-6"
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
              <p className="text-slate-300 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign In
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
