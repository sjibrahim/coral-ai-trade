
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
import MarketPage from "@/pages/MarketPage";
import TradePage from '@/pages/TradePage';
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
              <Route path="/market" element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />
              <Route path="/trade" element={<ProtectedRoute><TradePage /></ProtectedRoute>} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
