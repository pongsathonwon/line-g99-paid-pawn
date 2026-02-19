import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";

// Eagerly load critical components
import SplashScreen from "../pages/SplashScreen";
import NotfoundPage from "../pages/NotfoundPage";
import Protected from "../layout/MainLayout/Protected";
import PreventReRegister from "../layout/RegisterLayout/PreventReRegister";
import MainLayout from "../layout/MainLayout/MainLayout";
import PawnInterestLoader from "@/loaders/PawnInterestLoader";

/**
 * Wraps a dynamic import so that if the chunk is missing (stale cache after
 * a new deploy), the browser does one hard reload to fetch the latest build.
 * After reload the new chunk hash will be served correctly.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyWithReload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(() =>
    factory().catch(() => {
      window.location.reload();
      // Return a never-resolving promise — the reload above will take over
      return new Promise<never>(() => {});
    }),
  );
}

// Lazy load page components
const RegisterPage = lazyWithReload(
  () => import("../pages/register/RegisterPage"),
);
const ThaiRegisterPage = lazyWithReload(
  () => import("../pages/register/ThaiRegisterPage"),
);
const ForeignRegisterPage = lazyWithReload(
  () => import("../pages/register/ForeignRegisterPage"),
);
const ForeignCounterRegisterPage = lazyWithReload(
  () => import("@/pages/register/ForeignCounterRegisterPage"),
);
const RegisterResultPage = lazyWithReload(
  () => import("../pages/RegisterResultPage"),
);
const HomePage = lazyWithReload(() => import("../pages/HomePage"));
const PaymentDetailPage = lazyWithReload(
  () => import("../pages/PaymentDetailPage"),
);
const QRPage = lazyWithReload(() => import("../pages/QRPage"));
const PaymentSuccessPage = lazyWithReload(
  () => import("../pages/PaymentSuccessPage"),
);
const PaymentErrorPage = lazyWithReload(
  () => import("@/pages/PaymentErrorPage"),
);
const PaymentPendingPage = lazyWithReload(
  () => import("@/pages/PaymentPendingPage"),
);
const HistoryPage = lazyWithReload(() => import("../pages/HistoryPage"));
const HistoryDetailPage = lazyWithReload(
  () => import("../pages/HistroyDetailPage"),
);
const TermPage = lazyWithReload(() => import("@/pages/TermPage"));

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
      {
        path: "history/:paidNumb",
        element: <HistoryDetailPage />,
      },
    ],
  },
]);
