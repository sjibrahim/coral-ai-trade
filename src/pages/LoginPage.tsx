
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if user is already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from || "/home";
    navigate(from, { replace: true });
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      // Show validation error
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(phone, password);
      if (success) {
        // Redirect to home page or previous page
        const from = (location.state as any)?.from || "/home";
        navigate(from, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-[100svh] bg-background p-6">
      {/* Logo */}
      <div className="pt-12 pb-8">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
          <img 
            src="https://ik.imagekit.io/spmcumfu9/nexbit_logo.jpeg" 
            alt="Nexbit Logo" 
            className="w-10 h-10 object-contain rounded-lg"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mt-4 text-gradient-primary">
          Nexbit
        </h1>
        <p className="text-muted-foreground text-center text-sm mt-1">
          Sign in to your account
        </p>
      </div>
      
      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto w-full">
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium" htmlFor="phone">
            Phone Number
          </label>
          <Input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="bg-card/50 backdrop-blur-sm border-border/40 h-12"
            required
          />
        </div>
        
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
        
        <Button 
          type="submit" 
          className="w-full h-12 text-base shadow-lg shadow-blue-500/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Signing In...
            </span>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
      
      {/* Footer */}
      <div className="mt-auto pt-8 pb-4 text-center">
        <div className="flex justify-center gap-4 mb-4">
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link>
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; 2025 Nexbit. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
