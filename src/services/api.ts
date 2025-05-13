// API endpoints for our application
const API_BASE = '/backend/restapi';
const BINANCE_API = 'https://api.binance.com/api/v3';

export const endpoints = {
  test: `${API_BASE}/index`,
  login: `${API_BASE}/login`,
  register: `${API_BASE}/register`,
  getProfile: `${API_BASE}/get__profile`,
  getMarket: `${API_BASE}/get__market`,
  getCoin: `${API_BASE}/get_coin`, // New endpoint for getting coin details
  updateBank: `${API_BASE}/update_bank`,
  updatePassword: `${API_BASE}/update_password`,
  createTopupOrder: `${API_BASE}/create_topup_order`,
  createWithdrawOrder: `${API_BASE}/create_withdraw_order`,
  getTransactions: `${API_BASE}/transactions`,
  getDepositRecords: `${API_BASE}/get_deposit_records`,
  getWithdrawRecords: `${API_BASE}/get_withdraw_records`,
  getTeamDetails: `${API_BASE}/get_team_details`,
  getGeneralSettings: `${API_BASE}/get_general_settings`,
  getTradeRecords: `${API_BASE}/get_trade`,
  getCoinDetails: `${API_BASE}/get_coin_details`,
  placeTrade: `${API_BASE}/trade`, // New endpoint for placing trades
  // Binance API endpoints
  getBinancePrice: `${BINANCE_API}/ticker/price`,
  getBinanceKlines: `${BINANCE_API}/klines`,
  getSalaryRecords: `${API_BASE}/get_salary_records`, // New endpoint for salary records
};

// Function to handle API requests
export const apiRequest = async (url: string, method: string, data?: any) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!result.status && result.http_code === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return result;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Function to handle external API requests (like Binance)
export const externalApiRequest = async (url: string, params?: Record<string, string>) => {
  try {
    const urlWithParams = params 
      ? `${url}?${new URLSearchParams(params).toString()}`
      : url;
    
    const response = await fetch(urlWithParams);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('External API request failed:', error);
    throw error;
  }
};

// Market API functions
export const getMarketData = async (token: string) => {
  return apiRequest(endpoints.getMarket, 'POST', { token });
};

export const getCoinDetails = async (token: string, coinId: string) => {
  return apiRequest(endpoints.getCoinDetails, 'POST', { token, coinId });
};

// New function to get coin info by ID
export const getCoin = async (token: string, coin_id: string) => {
  return apiRequest(endpoints.getCoin, 'POST', { token, coin_id });
};

// Binance API functions
export const getBinancePrice = async (binanceSymbol: string) => {
  if (!binanceSymbol) {
    throw new Error('No Binance symbol provided');
  }
  return externalApiRequest(endpoints.getBinancePrice, { symbol: binanceSymbol });
};

export const getBinanceKlines = async (binanceSymbol: string, interval: string, limit: string) => {
  if (!binanceSymbol) {
    throw new Error('No Binance symbol provided');
  }
  return externalApiRequest(endpoints.getBinanceKlines, { 
    symbol: binanceSymbol, 
    interval, 
    limit 
  });
};

// Profile API functions
export const updateBankDetails = async (token: string, bankDetails: { 
  account_holder_name: string;
  account_number: string;
  account_ifsc: string;
  usdt_address?: string; // Added USDT address as an optional field
}) => {
  return apiRequest(endpoints.updateBank, 'POST', { token, ...bankDetails });
};

export const updatePassword = async (token: string, password: string, new_password: string) => {
  return apiRequest(endpoints.updatePassword, 'POST', { token, password, new_password });
};

// Transaction API functions
export const createTopupOrder = async (token: string, amount: number) => {
  return apiRequest(endpoints.createTopupOrder, 'POST', { token, amount });
};

// Updated to include USDT address
export const createWithdrawOrder = async (token: string, amount: number, usdt_address?: string) => {
  return apiRequest(endpoints.createWithdrawOrder, 'POST', { 
    token, 
    amount,
    usdt_address // Added USDT address to the payload
  });
};

export const getTransactions = async (token: string) => {
  return apiRequest(endpoints.getTransactions, 'POST', { token });
};

// New endpoints for deposit and withdrawal records
export const getDepositRecords = async (token: string) => {
  return apiRequest(endpoints.getDepositRecords, 'POST', { token });
};

export const getWithdrawRecords = async (token: string) => {
  return apiRequest(endpoints.getWithdrawRecords, 'POST', { token });
};

// New endpoint for trade/contract records
export const getTradeRecords = async (token: string) => {
  return apiRequest(endpoints.getTradeRecords, 'POST', { token });
};

// Team API functions
export const getTeamDetails = async (token: string) => {
  return apiRequest(endpoints.getTeamDetails, 'POST', { token });
};

// General settings API functions
export const getGeneralSettings = async (token: string) => {
  return apiRequest(endpoints.getGeneralSettings, 'POST', { token });
};

// New function to get salary records
export const getSalaryRecords = async (token: string) => {
  return apiRequest(endpoints.getSalaryRecords, 'POST', { token });
};

// Updated function for placing trades with better error handling and min_trade check
export const placeTrade = async (
  token: string, 
  trade_amount: number, 
  symbol: string, 
  direction: string, 
  opening_price: number, 
  sell_time: number
) => {
  try {
    console.log('Placing trade with params:', { token, trade_amount, symbol, direction, opening_price, sell_time });
    
    // Get general settings to check minimum trade amount
    const settingsResponse = await getGeneralSettings(token);
    if (settingsResponse.status && settingsResponse.data) {
      const minTradeAmount = parseFloat(settingsResponse.data.min_trade || "300");
      
      // Check if trade amount meets minimum requirement
      if (trade_amount < minTradeAmount) {
        return {
          success: false,
          message: `Trade amount must be at least ₹${minTradeAmount}`,
          data: null
        };
      }
    }
    
    const result = await apiRequest(endpoints.placeTrade, 'POST', {
      token,
      custom_amount: trade_amount,
      symbol,
      direction,
      opening_price,
      sell_time
    });
    
    console.log('Trade API response:', result);
    
    // Check if the response indicates success - also check for status: true format
    if (result.success || result.status === true) {
      return {
        success: true,
        message: result.message || result.msg || "Trade placed successfully",
        data: result.data
      };
    } else {
      // If API returns failure, format the error
      return {
        success: false,
        message: result.message || result.msg || "Failed to place trade",
        data: null
      };
    }
  } catch (error) {
    console.error('Trade API error:', error);
    // Handle network or other errors
    return {
      success: false,
      message: "Network error when placing trade. Please try again.",
      data: null
    };
  }
};
