import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ColorModeProvider } from "./components/ui/color-mode";
import { ChakraProvider, defaultSystem} from "@chakra-ui/react";
import { queryClient } from "../utils/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center"/>
          <App />
        </QueryClientProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>
);
