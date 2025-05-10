import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";

// Protected Pages
import HomePage from "@/pages/HomePage";
import MarketPage from "@/pages/MarketPage";
import CoinDetailPage from "@/pages/CoinDetailPage";
import DepositPage from "@/pages/DepositPage";
import WithdrawPage from "@/pages/WithdrawPage";
import DepositRecordsPage from "@/pages/DepositRecordsPage";
import WithdrawalRecordsPage from "@/pages/WithdrawalRecordsPage";
import TransactionRecordsPage from "@/pages/TransactionRecordsPage";
import ContractRecordPage from "@/pages/ContractRecordPage";
import SalaryRecordPage from "@/pages/SalaryRecordPage";
import TeamPage from "@/pages/TeamPage";
import InvitePage from "@/pages/InvitePage";
import RewardsPage from "@/pages/RewardsPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import BankDetailsPage from "@/pages/BankDetailsPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import SupportPage from "@/pages/SupportPage";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/coin/:id" element={<CoinDetailPage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/deposit-records" element={<DepositRecordsPage />} />
        <Route path="/withdrawal-records" element={<WithdrawalRecordsPage />} />
        <Route path="/transaction-records" element={<TransactionRecordsPage />} />
        <Route path="/contract-record" element={<ContractRecordPage />} />
        <Route path="/commission-record" element={<SalaryRecordPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/bank-details" element={<BankDetailsPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
