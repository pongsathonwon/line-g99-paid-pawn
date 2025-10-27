import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { APP_ROUTES } from "./routes/route";
import LineContextProvider from "./context/LineContext/LineContextProvider";
import { QueryProvider } from "./context/QueryProvider";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <LineContextProvider>
        <AuthContextProvider>
          <RouterProvider router={APP_ROUTES} />
        </AuthContextProvider>
      </LineContextProvider>
    </QueryProvider>
  </StrictMode>
);
