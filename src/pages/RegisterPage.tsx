
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Link as LinkIcon, Mail, Phone, Lock, Gift, TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral_code: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
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
    navigate("/home", { replace: true });
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
          title: "Welcome to Trexo!",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="pt-8 pb-6 px-6">
          <div className="max-w-sm mx-auto text-center">
            {/* Logo */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-2xl ring-4 ring-emerald-400/20 relative">
                <img 
                  src="https://ik.imagekit.io/spmcumfu9/trexo.jpeg" 
                  alt="Trexo Logo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-slate-900" />
              </div>
            </div>
            
            {/* Brand */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent mb-2">
              Join Trexo
            </h1>
            <p className="text-slate-300 mb-6">
              Professional Trading Platform
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-emerald-400" />
                <span>Live Markets</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Fast Trading</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 px-6 pb-8">
          <div className="max-w-sm mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Create Account</h2>
                <p className="text-slate-400 text-sm">Start your trading journey today</p>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2" htmlFor="phone">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 h-12 pl-4 pr-4 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      required
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2" htmlFor="email">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 h-12 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    required
                  />
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2" htmlFor="password">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 h-12 pr-12 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2" htmlFor="confirmPassword">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 h-12 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    required
                  />
                </div>
                
                {/* Referral Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2" htmlFor="referral_code">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    Referral Code
                    <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="referral_code"
                      name="referral_code"
                      type="text"
                      value={formData.referral_code}
                      onChange={handleChange}
                      placeholder="Enter referral code"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 h-12 pl-10 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <LinkIcon size={16} className="text-emerald-400" />
                    </div>
                  </div>
                </div>
                
                {/* Terms */}
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms} 
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mt-6"
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
            </div>
            
            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-slate-400">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-slate-500">
            &copy; 2025 Trexo. Professional Trading Platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
