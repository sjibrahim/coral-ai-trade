
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import DepositPage from "@/pages/DepositPage";
import WithdrawPage from "@/pages/WithdrawPage";
import InvitePage from "@/pages/InvitePage";
import ProfilePage from "@/pages/ProfilePage";
import TeamPage from "@/pages/TeamPage";
import TeamLevelPage from "@/pages/TeamLevelPage";
import MarketPage from "@/pages/MarketPage";
import TradePage from '@/pages/TradePage';
import CoinPage from '@/pages/CoinPage';
import USDTWithdraw from '@/pages/USDTWithdraw';
import ContractRecordsPage from '@/pages/ContractRecordsPage';
import SalaryRecordPage from '@/pages/SalaryRecordPage';
import TransactionRecordsPage from '@/pages/TransactionRecordsPage';
import SecurityPage from '@/pages/SecurityPage';
import BankDetailsPage from '@/pages/BankDetailsPage';
import WithdrawalRecordsPage from '@/pages/WithdrawalRecordsPage';
import CheckinPage from '@/pages/CheckinPage';
import ProtectedRoute from "@/components/ProtectedRoute";

// Create a new QueryClient outside of the component
const queryClient = new QueryClient();

// Set document title for CORAL
document.title = "CORAL - AI Trading Platform";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
              <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
              <Route path="/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
              <Route path="/team-level/:level" element={<ProtectedRoute><TeamLevelPage /></ProtectedRoute>} />
              <Route path="/market" element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />
              <Route path="/trade" element={<ProtectedRoute><TradePage /></ProtectedRoute>} />
              <Route path="/coin/:coinId" element={<ProtectedRoute><CoinPage /></ProtectedRoute>} />
              <Route path="/usdt-withdraw" element={<ProtectedRoute><USDTWithdraw /></ProtectedRoute>} />
              <Route path="/contracts" element={<ProtectedRoute><ContractRecordsPage /></ProtectedRoute>} />
              <Route path="/contract-records" element={<ProtectedRoute><ContractRecordsPage /></ProtectedRoute>} />
              <Route path="/salary" element={<ProtectedRoute><SalaryRecordPage /></ProtectedRoute>} />
              <Route path="/salary-records" element={<ProtectedRoute><SalaryRecordPage /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><TransactionRecordsPage /></ProtectedRoute>} />
              <Route path="/transaction-records" element={<ProtectedRoute><TransactionRecordsPage /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
              <Route path="/bank-details" element={<ProtectedRoute><BankDetailsPage /></ProtectedRoute>} />
              <Route path="/bank" element={<ProtectedRoute><BankDetailsPage /></ProtectedRoute>} />
              <Route path="/withdrawals" element={<ProtectedRoute><WithdrawalRecordsPage /></ProtectedRoute>} />
              <Route path="/withdrawal-records" element={<ProtectedRoute><WithdrawalRecordsPage /></ProtectedRoute>} />
              <Route path="/checkin" element={<ProtectedRoute><CheckinPage /></ProtectedRoute>} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
