import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { APP_ROUTES } from "./routes/route";
import LineContextProvider from "./context/LineContext/LineContextProvider";
import { QueryProvider } from "./context/QueryProvider";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";
import AppContainer from "./layout/AppContainer";
import PawnInterestContextProvider from "./context/PawnInterestContext/PawnInterestContextProvider";
import ToastContextProvider from "./context/ToastContext/ToastContextProvider";
import { SpeedInsights } from "@vercel/speed-insights/react";

declare const __BUILD_TIME__: string;
console.log(`[build] ${__BUILD_TIME__}`);

createRoot(document.getElementById("root")!).render(
  <ToastContextProvider>
    <QueryProvider>
      <LineContextProvider>
        <AuthContextProvider>
          <PawnInterestContextProvider>
            <AppContainer>
              <RouterProvider router={APP_ROUTES} />
              <SpeedInsights />
            </AppContainer>
          </PawnInterestContextProvider>
        </AuthContextProvider>
      </LineContextProvider>
    </QueryProvider>
  </ToastContextProvider>,
);
