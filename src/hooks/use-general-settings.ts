
import { useState, useEffect } from 'react';
import { getGeneralSettings } from '@/services/api';

interface GeneralSettings {
  min_withdrawal: string;
  min_deposit: string;
  level_1_commission: string;
  level_2_commission: string;
  level_3_commission: string;
  daily_profit: string;
  min_trade: string;
  usdt_price: string;
}

const defaultSettings: GeneralSettings = {
  min_withdrawal: "300",
  min_deposit: "300",
  level_1_commission: "5",
  level_2_commission: "3",
  level_3_commission: "1",
  daily_profit: "1.5",
  min_trade: "300",
  usdt_price: "85"
};

export function useGeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          setSettings({
            ...defaultSettings,
            ...response.data
          });
        } else {
          setError(response.msg || "Failed to fetch settings");
        }
      } catch (err) {
        console.error("Error fetching general settings:", err);
        setError("Error fetching settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

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

  return {
    settings,
    loading,
    error,
    isValidDeposit,
    isValidWithdrawal,
    isValidTrade,
    getUsdtPrice
  };
}
