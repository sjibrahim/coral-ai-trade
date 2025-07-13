
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Mail, Phone, Lock, Gift, Shield, Award, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileLayout from "@/components/layout/MobileLayout";

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
  const isMobile = useIsMobile();
  
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
  
  const content = (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-300/10 to-emerald-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-emerald-400/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-green-300/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-64 right-12 w-2 h-2 bg-emerald-500/40 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 py-4">{/* Reduced padding from py-6 to py-4 */}
        {/* Header */}
        <div className="text-center mb-4">{/* Reduced margin from mb-6 to mb-4 */}
          <div className="mx-auto mb-3">{/* Reduced margin from mb-4 to mb-3 */}
            <img 
              src="https://ik.imagekit.io/spmcumfu9/trexo.jpeg" 
              alt="Trexo Logo" 
              className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} mx-auto rounded-2xl object-cover shadow-lg`}
            />
          </div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1`}>{/* Reduced margin from mb-2 to mb-1 */}
            Join Trexo
          </h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
            Start your trading journey today
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mb-4">{/* Reduced margin from mb-6 to mb-4 */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-200/50">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">Bank Grade Security</span>
            </div>
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-200/50">
              <Lock className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">256-bit Encryption</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-200/50">
              <Award className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Trusted by 1M+</span>
            </div>
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-orange-200/50">
              <Zap className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">Instant Trading</span>
            </div>
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-200/50">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">RBI Compliant</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="w-full max-w-md mx-auto mb-4">{/* Added mb-4 to reduce bottom spacing */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/20">{/* Reduced padding from p-6 to p-5 */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Phone Number
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="text-sm font-medium text-gray-500 border-r border-gray-300 pr-3 mr-3">🇮🇳 +91</span>
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="h-12 text-base pl-20 pr-12 bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300"
                    maxLength={10}
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                  </div>
                </div>
                {formData.phone && formData.phone.length < 10 && (
                  <p className="text-xs text-red-500 ml-1">Please enter 10 digits</p>
                )}
              </div>
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
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
                    className="h-12 text-base pl-4 pr-12 bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    className="h-12 text-base pl-4 pr-12 bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-green-500 transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="h-12 text-base pl-4 pr-12 bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              {/* Referral Code Field */}
              <div className="space-y-2">
                <Label htmlFor="referral_code" className="text-sm font-semibold text-gray-700">
                  Referral Code <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </Label>
                <div className="relative group">
                  <Input
                    id="referral_code"
                    name="referral_code"
                    type="text"
                    value={formData.referral_code}
                    onChange={handleChange}
                    placeholder="Enter referral code"
                    className="h-12 text-base pl-12 pr-4 bg-gray-50/50 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 focus:bg-white rounded-2xl transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Gift className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                  </div>
                </div>
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
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-300">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
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
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center space-y-2 mt-4">{/* Reduced spacing and margin */}
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-300">
              Sign In
            </Link>
          </p>
          
          <p className="text-xs text-gray-500 leading-relaxed px-4">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-green-600 hover:underline transition-colors duration-300">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-green-600 hover:underline transition-colors duration-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
  
  // For mobile, wrap in MobileLayout, for desktop show directly
  if (isMobile) {
    return (
      <MobileLayout>
        {content}
      </MobileLayout>
    );
  }
  
  return content;
};

export default RegisterPage;
