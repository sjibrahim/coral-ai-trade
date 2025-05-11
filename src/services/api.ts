
// API endpoints for our application
const API_BASE = '/backend/restapi';
const BINANCE_API = 'https://api.binance.com/api/v3';

export const endpoints = {
  test: `${API_BASE}/index`,
  login: `${API_BASE}/login`,
  register: `${API_BASE}/register`,
  getProfile: `${API_BASE}/get__profile`,
  getMarket: `${API_BASE}/get__market`,
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
  // Binance API endpoints
  getBinancePrice: `${BINANCE_API}/ticker/price`,
  getBinanceKlines: `${BINANCE_API}/klines`,
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

// Binance API functions
export const getBinancePrice = async (symbol: string) => {
  return externalApiRequest(endpoints.getBinancePrice, { symbol });
};

export const getBinanceKlines = async (symbol: string, interval: string, limit: string) => {
  return externalApiRequest(endpoints.getBinanceKlines, { 
    symbol, 
    interval, 
    limit 
  });
};

// Profile API functions
export const updateBankDetails = async (token: string, bankDetails: { 
  account_holder_name: string;
  account_number: string;
  account_ifsc: string;
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

export const createWithdrawOrder = async (token: string, amount: number) => {
  return apiRequest(endpoints.createWithdrawOrder, 'POST', { token, amount });
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
