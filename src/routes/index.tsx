import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import DepositPage from "@/pages/DepositPage";
import WithdrawPage from "@/pages/WithdrawPage";
import InvitePage from "@/pages/InvitePage";
import ProfilePage from "@/pages/ProfilePage";
import TeamPage from "@/pages/TeamPage";
import MarketPage from "@/pages/MarketPage";
import CoinPage from "@/pages/CoinPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import USDTWithdraw from "@/pages/USDTWithdraw";
import TradePage from '@/pages/TradePage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: "/home",
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/deposit",
    element: <ProtectedRoute><DepositPage /></ProtectedRoute>,
  },
  {
    path: "/withdraw",
    element: <ProtectedRoute><WithdrawPage /></ProtectedRoute>,
  },
  {
    path: "/invite",
    element: <ProtectedRoute><InvitePage /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
  },
  {
    path: "/team",
    element: <ProtectedRoute><TeamPage /></ProtectedRoute>,
  },
  {
    path: "/market",
    element: <ProtectedRoute><MarketPage /></ProtectedRoute>,
  },
  {
    path: "/coin/:coinId",
    element: <ProtectedRoute><CoinPage /></ProtectedRoute>,
  },
  {
    path: '/usdt-withdraw',
    element: <ProtectedRoute><USDTWithdraw /></ProtectedRoute>
  },
  {
    path: '/trade',
    element: <ProtectedRoute><TradePage /></ProtectedRoute>
  },
]);
