
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import { apiRequest, endpoints } from "@/services/api";

type User = {
  name?: string;
  phone?: string;
  wallet?: string;
  income?: string;
  fixed?: string;
  parent?: string;
  referral_code?: string;
  commission?: string;
  rank?: string;
  account_holder_name?: string;
  account_number?: string;
  account_ifsc?: string;
  token: string;
  yesterday_income?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (phone: string, email: string, password: string, confirm_password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileUpdateInProgress, setProfileUpdateInProgress] = useState(false);
  
  // Memoize the updateProfile function to prevent unnecessary re-renders
  const updateProfile = useCallback(async (): Promise<boolean> => {
    // If an update is already in progress, don't start another one
    if (profileUpdateInProgress) return false;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      setProfileUpdateInProgress(true);
      
      // Use the apiRequest utility for consistency
      const data = await apiRequest(endpoints.getProfile, 'POST', { token });
      
      if (data.status) {
        setUser(data.data);
        return true;
      } else {
        if (data.http_code === 401) {
          // Token expired or invalid
          logout();
        }
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setProfileUpdateInProgress(false);
    }
  }, [profileUpdateInProgress]);
  
  // Check for stored token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const data = await apiRequest(endpoints.getProfile, 'POST', { token });
          
          if (data.status) {
            setUser(data.data);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await apiRequest(endpoints.login, 'POST', { phone, password });
      
      if (data.status) {
        localStorage.setItem('auth_token', data.data.token);
        setUser(data.data);
        toast({
          title: "Login successful",
          description: "Welcome back!",
          duration: 3000,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: data.msg || "Invalid credentials",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (phone: string, email: string, password: string, confirm_password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await apiRequest(endpoints.register, 'POST', { 
        phone, 
        email, 
        password, 
        confirm_password 
      });
      
      if (data.status) {
        localStorage.setItem('auth_token', data.data.token);
        // After registration, fetch the user profile
        await updateProfile();
        toast({
          title: "Registration successful",
          description: "Your account has been created",
          duration: 3000,
        });
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: data.msg || "Registration failed",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "An error occurred during registration",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      duration: 3000,
    });
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        login, 
        register, 
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
