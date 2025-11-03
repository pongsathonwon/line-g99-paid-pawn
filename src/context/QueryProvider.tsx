import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const QueryProvider = ({ children }: React.PropsWithChildren) =>
  QueryClientProvider({ children, client: QUERY_CLIENT });
