import { createBrowserRouter } from "react-router-dom";
import SplashScreen from "../pages/SplashScreen";
import RegisterPage from "../pages/RegisterPage";
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

export const APP_ROUTES = createBrowserRouter([
  {
    path: "",
    element: <SplashScreen />,
    errorElement: <NotfoundPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "register/result",
    element: <RegisterResultPage />,
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
            element: <PaymentDetailPage />,
          },
          {
            path: ":id/qr",
            element: <QRPage />,
          },
          {
            path: ":id/success",
            element: <PaymentSuccessPage />,
          },
          {
            path: ":id/fail",
            element: <PaymentSuccessPage />,
          },
          {
            path: ":id/pending",
            element: <PaymentSuccessPage />,
          },
        ],
      },
      {
        path: "term",
        element: <div></div>,
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
