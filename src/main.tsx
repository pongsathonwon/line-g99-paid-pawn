import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { APP_ROUTES } from "./routes/route";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={APP_ROUTES} />
  </StrictMode>
);
