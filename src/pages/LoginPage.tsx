
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Shield, TrendingUp, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

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
    return (
      <div className="flex min-h-screen bg-background items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading Trexo...</p>
        </div>
      </div>
    );
  }
  
  const { login, isAuthenticated } = auth;
  const navigate = useNavigate();
  
  if (isAuthenticated) {
    setTimeout(() => navigate("/home", { replace: true }), 0);
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(formData.phone, formData.password);
      
      if (success) {
        toast({
          title: "Welcome to Trexo!",
          description: "Login successful",
          duration: 1000,
        });
        
        navigate("/home", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header with logo and branding */}
      <div className="flex-shrink-0 pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg border border-primary/20">
            <img 
              src="https://ik.imagekit.io/spmcumfu9/trexo.jpeg" 
              alt="Trexo Logo" 
              className="w-12 h-12 rounded-xl object-cover"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome to <span className="text-primary">Trexo</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your professional trading platform
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>Live Trading</span>
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
              <Shield className="w-3 h-3" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
              <Smartphone className="w-3 h-3" />
              <span>Mobile Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8">
        <div className="w-full max-w-md space-y-6">
          {/* Login form card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-2">
                Sign In
              </h2>
              <p className="text-muted-foreground text-sm">
                Access your trading account
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Phone number field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="phone" 
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  Phone Number
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="h-12 pl-4 pr-4 text-base border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200 rounded-xl bg-background"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Password field */}
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  Password
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-12 pl-4 pr-12 text-base border-2 border-input focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200 rounded-xl bg-background"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Trexo</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
          
          {/* Register link */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              New to Trexo?{" "}
              <Link 
                to="/register" 
                className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
          
          {/* Additional info */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex-shrink-0 text-center py-4 px-4">
        <p className="text-xs text-muted-foreground">
          &copy; 2025 Trexo. Empowering traders worldwide.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
