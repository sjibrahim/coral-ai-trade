
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import TradePage from '@/pages/TradePage';
import MarketPage from '@/pages/MarketPage';
import TeamPage from '@/pages/TeamPage';
import InvitePage from '@/pages/InvitePage';
import DepositPage from '@/pages/DepositPage';
import WithdrawPage from '@/pages/WithdrawPage';
import USDTWithdraw from '@/pages/USDTWithdraw';
import BankDetailsPage from '@/pages/BankDetailsPage';
import SecurityPage from '@/pages/SecurityPage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import TransactionRecordsPage from '@/pages/TransactionRecordsPage';
import WithdrawalRecordsPage from '@/pages/WithdrawalRecordsPage';
import DepositRecordsPage from '@/pages/DepositRecordsPage';
import ContractRecordsPage from '@/pages/ContractRecordsPage';
import SalaryRecordPage from '@/pages/SalaryRecordPage';
import TeamLevelPage from '@/pages/TeamLevelPage';
import VipPage from '@/pages/VipPage';
import RewardsPage from '@/pages/RewardsPage';
import SupportPage from '@/pages/SupportPage';
import SettingsPage from '@/pages/SettingsPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import NotFound from '@/pages/NotFound';
import CoinPage from '@/pages/CoinPage';
import CoinDetailPage from '@/pages/CoinDetailPage';
import CheckinPage from '@/pages/CheckinPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/trade" element={<ProtectedRoute><TradePage /></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
      <Route path="/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
      <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
      <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
      <Route path="/usdt-withdraw" element={<ProtectedRoute><USDTWithdraw /></ProtectedRoute>} />
      <Route path="/bank" element={<ProtectedRoute><BankDetailsPage /></ProtectedRoute>} />
      <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
      <Route path="/transaction-records" element={<ProtectedRoute><TransactionRecordsPage /></ProtectedRoute>} />
      <Route path="/withdrawal-records" element={<ProtectedRoute><WithdrawalRecordsPage /></ProtectedRoute>} />
      <Route path="/deposit-records" element={<ProtectedRoute><DepositRecordsPage /></ProtectedRoute>} />
      <Route path="/contract-records" element={<ProtectedRoute><ContractRecordsPage /></ProtectedRoute>} />
      <Route path="/salary-records" element={<ProtectedRoute><SalaryRecordPage /></ProtectedRoute>} />
      <Route path="/team/level/:level" element={<ProtectedRoute><TeamLevelPage /></ProtectedRoute>} />
      <Route path="/vip" element={<ProtectedRoute><VipPage /></ProtectedRoute>} />
      <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/terms" element={<ProtectedRoute><TermsPage /></ProtectedRoute>} />
      <Route path="/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
      <Route path="/coins" element={<ProtectedRoute><CoinPage /></ProtectedRoute>} />
      <Route path="/coin/:coinId" element={<ProtectedRoute><CoinDetailPage /></ProtectedRoute>} />
      <Route path="/checkin" element={<ProtectedRoute><CheckinPage /></ProtectedRoute>} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
