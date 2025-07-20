import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "@fontsource/poppins";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster
      theme="light"
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "border-l-4 border-purple-600 shadow-lg",
          title: "text-purple-700 font-semibold",
          description: "text-sm text-gray-600",
        },
      }}
    />
  </QueryClientProvider>,
);
