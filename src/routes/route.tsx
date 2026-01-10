import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";

// Eagerly load critical components
import SplashScreen from "../pages/SplashScreen";
import NotfoundPage from "../pages/NotfoundPage";
import Protected from "../layout/MainLayout/Protected";
import PreventReRegister from "../layout/RegisterLayout/PreventReRegister";
import MainLayout from "../layout/MainLayout/MainLayout";
import PawnInterestLoader from "@/loaders/PawnInterestLoader";

// Lazy load page components
const RegisterPage = lazy(() => import("../pages/register/RegisterPage"));
const ThaiRegisterPage = lazy(
  () => import("../pages/register/ThaiRegisterPage")
);
const ForeignRegisterPage = lazy(
  () => import("../pages/register/ForeignRegisterPage")
);
const ForeignCounterRegisterPage = lazy(
  () => import("@/pages/register/ForeignCounterRegisterPage")
);
const RegisterResultPage = lazy(() => import("../pages/RegisterResultPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const PaymentDetailPage = lazy(() => import("../pages/PaymentDetailPage"));
const QRPage = lazy(() => import("../pages/QRPage"));
const PaymentSuccessPage = lazy(() => import("../pages/PaymentSuccessPage"));
const PaymentErrorPage = lazy(() => import("@/pages/PaymentErrorPage"));
const PaymentPendingPage = lazy(() => import("@/pages/PaymentPendingPage"));
const HistoryPage = lazy(() => import("../pages/HistoryPage"));
const NotificationPage = lazy(() => import("../pages/NotificationPage"));
const TermPage = lazy(() => import("@/pages/TermPage"));

export const APP_ROUTES = createBrowserRouter([
  {
    path: "",
    element: <SplashScreen />,
    errorElement: <NotfoundPage />,
  },
  {
    element: (
      <PreventReRegister>
        <Outlet />
      </PreventReRegister>
    ),
    children: [
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
    ],
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
    ],
  },
]);
