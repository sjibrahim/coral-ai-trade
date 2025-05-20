
import { useState, useEffect } from 'react';
import { getGeneralSettings } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface GeneralSettings {
  min_withdrawal: string;
  min_deposit: string;
  level_1_commission: string;
  level_2_commission: string;
  level_3_commission: string;
  daily_profit: string;
  min_trade: string;
  usdt_price: string;
  telegram_channel: string;
  customer_support: string;
  withdrawal_fee: string;
}

const defaultSettings: GeneralSettings = {
  min_withdrawal: "300",
  min_deposit: "300",
  level_1_commission: "5",
  level_2_commission: "3",
  level_3_commission: "1",
  daily_profit: "1.5",
  min_trade: "300",
  usdt_price: "85",
  telegram_channel: "https://t.me/nexbit_official",
  customer_support: "Available 24/7 to help with any issues",
  withdrawal_fee: "10"
};

// Cache settings key in localStorage
const SETTINGS_CACHE_KEY = 'nexbit_general_settings';
const SETTINGS_CACHE_TIMESTAMP = 'nexbit_general_settings_timestamp';
const CACHE_MAX_AGE = 1000 * 60 * 5; // 5 minutes

export function useGeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettings>(() => {
    // Try to get cached settings on initial render
    try {
      const cachedSettings = localStorage.getItem(SETTINGS_CACHE_KEY);
      const timestamp = localStorage.getItem(SETTINGS_CACHE_TIMESTAMP);
      
      if (cachedSettings && timestamp) {
        const parsedTimestamp = parseInt(timestamp, 10);
        const now = Date.now();
        
        // If cache is still valid, use it
        if (now - parsedTimestamp < CACHE_MAX_AGE) {
          return JSON.parse(cachedSettings);
        }
      }
    } catch (err) {
      console.error('Error reading cached settings:', err);
    }
    
    // Fall back to default settings
    return defaultSettings;
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await getGeneralSettings(token);
        
        if (response.status && response.data) {
          const newSettings = {
            ...defaultSettings,
            ...response.data
          };
          
          setSettings(newSettings);
          
          // Cache the settings
          try {
            localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(newSettings));
            localStorage.setItem(SETTINGS_CACHE_TIMESTAMP, Date.now().toString());
          } catch (err) {
            console.error('Error caching settings:', err);
          }
        } else {
          setError(response.msg || "Failed to fetch settings");
          toast({
            title: "Settings Error",
            description: "Could not load application settings",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching general settings:", err);
        setError("Error fetching settings");
        toast({
          title: "Connection Error",
          description: "Could not connect to server",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  // Force refresh the settings
  const refreshSettings = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError("No authentication token found");
        return;
      }
      
      const response = await getGeneralSettings(token);
      
      if (response.status && response.data) {
        const newSettings = {
          ...defaultSettings,
          ...response.data
        };
        
        setSettings(newSettings);
        
        // Update cache
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(newSettings));
        localStorage.setItem(SETTINGS_CACHE_TIMESTAMP, Date.now().toString());
      }
    } catch (err) {
      console.error("Error refreshing settings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for validation
  const isValidDeposit = (amount: number) => {
    const minDeposit = parseInt(settings.min_deposit) || 300;
    return amount >= minDeposit;
  };

  const isValidWithdrawal = (amount: number) => {
    const minWithdrawal = parseInt(settings.min_withdrawal) || 300;
    return amount >= minWithdrawal;
  };

  const isValidTrade = (amount: number) => {
    const minTrade = parseInt(settings.min_trade) || 300;
    return amount >= minTrade;
  };

  const getUsdtPrice = () => {
    return parseFloat(settings.usdt_price) || 85;
  };
  
  const getTelegramChannel = () => {
    return settings.telegram_channel || "https://t.me/nexbit_official";
  };

  return {
    settings,
    loading,
    error,
    isValidDeposit,
    isValidWithdrawal,
    isValidTrade,
    getUsdtPrice,
    getTelegramChannel,
    refreshSettings
  };
}
