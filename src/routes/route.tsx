import { createBrowserRouter, Outlet } from "react-router-dom";
import SplashScreen from "../pages/SplashScreen";
import RegisterPage from "../pages/register/RegisterPage";
import ForeignRegisterPage from "../pages/register/ForeignRegisterPage";
import RegisterResultPage from "../pages/RegisterResultPage";
import Protected from "../layout/MainLayout/Protected";
import HomePage from "../pages/HomePage";
import PaymentDetailPage from "../pages/PaymentDetailPage";
import QRPage from "../pages/QRPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import HistoryPage from "../pages/HistoryPage";
import NotificationPage from "../pages/NotificationPage";
import NotfoundPage from "../pages/NotfoundPage";
import MainLayout from "../layout/MainLayout/MainLayout";
import TermPage from "@/pages/TermPage";
import PaymentErrorPage from "@/pages/PaymentErrorPage";
import PawnInterestLoader from "@/loaders/PawnInterestLoader";
import PaymentPendingPage from "@/pages/PaymentPendingPage";
import ForeignCounterRegisterPage from "@/pages/register/ForeignCounterRegisterPage";
import ThaiRegisterPage from "@/pages/register/ThaiRegisterPage";

export const APP_ROUTES = createBrowserRouter([
  {
    path: "",
    element: <SplashScreen />,
    errorElement: <NotfoundPage />,
  },
  {
    path: "register/result",
    element: <RegisterResultPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "thai-register",
    element: <ThaiRegisterPage />,
  },
  {
    path: "foreign-register",
    element: <ForeignRegisterPage />,
  },
  {
    path: "foreign-counter-register",
    element: <ForeignCounterRegisterPage />,
  },
  {
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    children: [
      {
        path: "home",

        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: ":id",
            element: (
              <PawnInterestLoader>
                <Outlet />
              </PawnInterestLoader>
            ),
            children: [
              {
                path: "",
                element: <PaymentDetailPage />,
              },
              {
                path: "qr",
                element: <QRPage />,
              },
            ],
          },
          {
            path: ":id/success",
            element: <PaymentSuccessPage />,
          },
          {
            path: ":id/fail",
            element: <PaymentErrorPage />,
          },
          {
            path: ":id/pending",
            element: <PaymentPendingPage />,
          },
        ],
      },
      {
        path: "term",
        element: <TermPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
      {
        path: "notification",
        element: <NotificationPage />,
      },
    ],
  },
]);
