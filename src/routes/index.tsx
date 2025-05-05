
import { Route, Routes, Navigate } from 'react-router-dom';

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Main App Routes */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/market" element={<MarketPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/coin/:id" element={<CoinDetailPage />} />
      <Route path="/deposit" element={<DepositPage />} />
      <Route path="/withdraw" element={<WithdrawPage />} />
      <Route path="/invite" element={<InvitePage />} />
      <Route path="/bank" element={<BankDetailsPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/deposit-records" element={<DepositRecordsPage />} />
      <Route path="/withdrawal-records" element={<WithdrawalRecordsPage />} />
      <Route path="/contract-record" element={<ContractRecordPage />} />
      <Route path="/commission-record" element={<CommissionRecordPage />} />
      <Route path="/salary-record" element={<SalaryRecordPage />} />
      <Route path="/rewards" element={<RewardsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
