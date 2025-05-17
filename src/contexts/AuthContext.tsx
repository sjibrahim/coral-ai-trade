
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { toast } from "@/hooks/use-toast";
import { apiRequest, endpoints, getGeneralSettings } from "@/services/api";

type User = {
  name?: string;
  phone?: string;
  wallet?: string;
  income?: string;
  fixed?: string;
  parent?: string;
  referral_code?: string;
  invite_code?: string;
  id?: string;
  salary?: string;
  rank?: string;
  account_holder_name?: string;
  account_number?: string;
  account_ifsc?: string;
  usdt_address?: string;
  token: string;
  yesterday_income?: string;
  deposit?: string;
  today_income?: string;
  total_income?: string;
};

interface GeneralSettings {
  min_withdrawal: string;
  min_deposit: string;
  level_1_commission: string;
  level_2_commission: string;
  level_3_commission: string;
  signup_bonus: string;
  min_trade: string;
  daily_profit: string;
  usdt_price?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (phone: string, email: string, password: string, confirm_password: string, referral_code?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: () => Promise<boolean>;
  generalSettings: GeneralSettings | null;
  loadGeneralSettings: () => Promise<GeneralSettings | null>;
  refreshUserData: () => void;  // New function to refresh user data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileUpdateInProgress, setProfileUpdateInProgress] = useState(false);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const lastRefreshTimeRef = useRef<number>(0); // Track last refresh timestamp
  
  // Load general settings
  const loadGeneralSettings = useCallback(async (): Promise<GeneralSettings | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await getGeneralSettings(token);
      
      if (response.status && response.data) {
        setGeneralSettings(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to load general settings:', error);
      return null;
    }
  }, []);
  
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
        
        // Also load general settings
        await loadGeneralSettings();
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
  }, [profileUpdateInProgress, loadGeneralSettings]);

  // New function to manually refresh user data with rate limiting (once per 30 seconds at most)
  const refreshUserData = useCallback(() => {
    // Only refresh if we haven't refreshed in the last 30 seconds and we have a user
    const now = Date.now();
    const REFRESH_COOLDOWN = 30000; // 30 seconds cooldown
    
    if (now - lastRefreshTimeRef.current > REFRESH_COOLDOWN && user?.token && !profileUpdateInProgress) {
      lastRefreshTimeRef.current = now;
      updateProfile().catch(console.error);
    }
  }, [updateProfile, user, profileUpdateInProgress]);
  
  // Check for stored token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const data = await apiRequest(endpoints.getProfile, 'POST', { token });
          
          if (data.status) {
            setUser(data.data);
            lastRefreshTimeRef.current = Date.now(); // Set initial refresh timestamp
            // Load general settings during initial auth check
            await loadGeneralSettings();
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
  }, [loadGeneralSettings]);
  
  const login = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await apiRequest(endpoints.login, 'POST', { phone, password });
      
      if (data.status) {
        localStorage.setItem('auth_token', data.data.token);
        setUser(data.data);
        
        // Explicitly call updateProfile after login
        await updateProfile();
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: data.msg || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (
    phone: string, 
    email: string, 
    password: string, 
    confirm_password: string,
    referral_code?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const payload = { 
        phone, 
        email, 
        password, 
        confirm_password,
        referral_code
      };
      
      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });
      
      const data = await apiRequest(endpoints.register, 'POST', payload);
      
      if (data.status) {
        localStorage.setItem('auth_token', data.data.token);
        // After registration, fetch the user profile
        await updateProfile();
        toast({
          title: "Registration successful",
          description: "Your account has been created",
        });
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: data.msg || "Registration failed",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "An error occurred during registration",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setGeneralSettings(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
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
        updateProfile,
        generalSettings,
        loadGeneralSettings,
        refreshUserData
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
