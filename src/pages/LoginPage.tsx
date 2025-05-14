
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Wrap the useAuth hook in a try-catch to handle the case when AuthProvider is not available
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context not available:", error);
    // Return a loading state or placeholder if auth is not available
    return (
      <div className="flex flex-col min-h-[100svh] bg-background p-6 items-center justify-center">
        <div className="w-20 h-20 rounded-xl flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }
  
  const { login, isAuthenticated } = auth;
  const navigate = useNavigate();
  
  // Redirect if user is already authenticated
  if (isAuthenticated) {
    navigate("/home", { replace: true });
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      // Show validation error
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(formData.phone, formData.password);
      
      if (success) {
        // Show success toast
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          duration: 500, // 500ms timeout
        });
        
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
          Sign in to your account
        </p>
      </div>
      
      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto w-full">
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
          className="w-full h-12 mt-4 text-base shadow-lg shadow-blue-500/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Create Account
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

export default LoginPage;
