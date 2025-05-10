
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import pages
import HomePage from '@/pages/HomePage';
import MarketPage from '@/pages/MarketPage';
import TeamPage from '@/pages/TeamPage';
import ProfilePage from '@/pages/ProfilePage';
import CoinDetailPage from '@/pages/CoinDetailPage';
import DepositPage from '@/pages/DepositPage';
import WithdrawPage from '@/pages/WithdrawPage';
import InvitePage from '@/pages/InvitePage';
import BankDetailsPage from '@/pages/BankDetailsPage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import SupportPage from '@/pages/SupportPage';
import DepositRecordsPage from '@/pages/DepositRecordsPage';
import WithdrawalRecordsPage from '@/pages/WithdrawalRecordsPage';
import ContractRecordPage from '@/pages/ContractRecordPage';
import CommissionRecordPage from '@/pages/CommissionRecordPage';
import SalaryRecordPage from '@/pages/SalaryRecordPage';
import RewardsPage from '@/pages/RewardsPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFound from '@/pages/NotFound';
import TransactionRecordsPage from '@/pages/TransactionRecordsPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/coin/:id" element={<ProtectedRoute><CoinDetailPage /></ProtectedRoute>} />
      <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
      <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
      <Route path="/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />
      <Route path="/bank" element={<ProtectedRoute><BankDetailsPage /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
      <Route path="/deposit-records" element={<ProtectedRoute><DepositRecordsPage /></ProtectedRoute>} />
      <Route path="/withdrawal-records" element={<ProtectedRoute><WithdrawalRecordsPage /></ProtectedRoute>} />
      <Route path="/contract-record" element={<ProtectedRoute><ContractRecordPage /></ProtectedRoute>} />
      <Route path="/commission-record" element={<ProtectedRoute><CommissionRecordPage /></ProtectedRoute>} />
      <Route path="/salary-record" element={<ProtectedRoute><SalaryRecordPage /></ProtectedRoute>} />
      <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionRecordsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
