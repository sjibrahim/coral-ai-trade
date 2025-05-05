
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual registration logic
    console.log("Registering with:", formData);
  };
  
  return (
    <div className="flex flex-col min-h-[100svh] bg-background p-6">
      {/* Logo */}
      <div className="pt-12 pb-8">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-center mt-4 text-gradient-primary">
          TradeCrypto
        </h1>
        <p className="text-muted-foreground text-center text-sm mt-1">
          Create a new account
        </p>
      </div>
      
      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4 max-w-sm mx-auto w-full">
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium" htmlFor="name">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
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
          disabled={!agreeTerms}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Account
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
          &copy; 2025 TradeCrypto. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
