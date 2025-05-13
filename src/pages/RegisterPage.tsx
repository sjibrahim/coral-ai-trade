
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Link as LinkIcon } from "lucide-react";
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
  
  // Redirect if user is already authenticated
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
        title: "Missing Fields",
        description: "Please fill all required fields",
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
    
    setIsSubmitting(true);
    
    try {
      // Pass referral code to register function
      const success = await register(
        formData.phone,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.referral_code
      );
      
      if (success) {
        navigate("/home", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-[100svh] bg-background p-6">
      {/* Logo */}
      <div className="pt-12 pb-8">
        <div className="w-20 h-20 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
          <img src="https://ik.imagekit.io/spmcumfu9/nexbit_logo.jpeg" alt="Nexbit Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-center mt-4 text-gradient-primary">
          Nexbit
        </h1>
        <p className="text-muted-foreground text-center text-sm mt-1">
          Create a new account
        </p>
      </div>
      
      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto w-full">
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium" htmlFor="phone">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="bg-card/50 backdrop-blur-sm border-border/40 h-12"
            required
          />
        </div>
        
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium" htmlFor="email">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="bg-card/50 backdrop-blur-sm border-border/40 h-12"
            required
          />
        </div>
        
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium" htmlFor="password">
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
              className="bg-card/50 backdrop-blur-sm border-border/40 h-12 pr-10"
              required
            />
            <button
              type="button"
              className="absolute top-0 right-0 h-full px-3 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="bg-card/50 backdrop-blur-sm border-border/40 h-12"
            required
          />
        </div>
        
        {/* Referral Code */}
        <div className="space-y-2 text-left">
          <div className="flex items-center">
            <label className="text-sm font-medium" htmlFor="referral_code">
              Referral Code
            </label>
            <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
          </div>
          <div className="relative">
            <Input
              id="referral_code"
              name="referral_code"
              type="text"
              value={formData.referral_code}
              onChange={handleChange}
              placeholder="Enter referral code"
              className="bg-card/50 backdrop-blur-sm border-border/40 h-12 pl-10"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <LinkIcon size={18} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox 
            id="terms" 
            checked={agreeTerms} 
            onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} 
          />
          <label
            htmlFor="terms"
            className="text-sm text-muted-foreground"
          >
            I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 mt-4 text-base shadow-lg shadow-blue-500/20"
          disabled={!agreeTerms || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Creating Account...
            </span>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
      
      {/* Footer */}
      <div className="mt-auto pt-8 pb-4 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; 2025 Nexbit. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
