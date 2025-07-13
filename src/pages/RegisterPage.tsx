
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Link as LinkIcon, Mail, Phone, Lock, Gift } from "lucide-react";
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
    <div className="flex flex-col min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-16 right-10 w-28 h-28 bg-green-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex flex-col px-6 py-8 relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-6 animate-fade-in-scale">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/50 animate-pulse-ring">
            <img 
              src="https://ik.imagekit.io/spmcumfu9/trexo.jpeg" 
              alt="Trexo Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-gradient-trexo mb-1">
            Join Trexo
          </h1>
          <p className="text-gray-600">
            Start your trading journey today
          </p>
        </div>

        {/* Registration Form */}
        <div className="max-w-sm mx-auto w-full flex-1">
          <div className="card-modern p-6 animate-slide-in-up">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Phone Number */}
              <div className="space-y-2 animate-slide-in-left">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="phone">
                  <Phone className="w-4 h-4 text-green-500" />
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="input-modern h-11 w-full"
                  required
                />
              </div>
              
              {/* Email */}
              <div className="space-y-2 animate-slide-in-right">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="email">
                  <Mail className="w-4 h-4 text-green-500" />
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input-modern h-11 w-full"
                  required
                />
              </div>
              
              {/* Password */}
              <div className="space-y-2 animate-slide-in-left">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="password">
                  <Lock className="w-4 h-4 text-green-500" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="input-modern h-11 w-full pr-11"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-11 px-3 text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password */}
              <div className="space-y-2 animate-slide-in-right">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="confirmPassword">
                  <Lock className="w-4 h-4 text-green-500" />
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="input-modern h-11 w-full"
                  required
                />
              </div>
              
              {/* Referral Code */}
              <div className="space-y-2 animate-slide-in-left">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="referral_code">
                  <Gift className="w-4 h-4 text-green-500" />
                  Referral Code
                  <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Input
                    id="referral_code"
                    name="referral_code"
                    type="text"
                    value={formData.referral_code}
                    onChange={handleChange}
                    placeholder="Enter referral code"
                    className="input-modern h-11 w-full pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <LinkIcon size={16} className="text-green-500" />
                  </div>
                </div>
              </div>
              
              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 pt-2 animate-slide-in-up">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="btn-primary-modern w-full h-12 text-base mt-6 animate-slide-in-up"
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
          <div className="text-center mt-4 animate-fade-in-scale">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center py-4 animate-fade-in-scale">
        <p className="text-xs text-gray-500">
          &copy; 2025 Trexo. Empowering traders worldwide.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
