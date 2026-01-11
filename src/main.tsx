import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress expected MetaMask console errors and warnings
if (typeof window !== "undefined") {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || "";
    
    // Filter out expected MetaMask errors
    if (
      message.includes("not been authorized") ||
      message.includes("User denied transaction signature") ||
      message.includes("user rejected") ||
      message.includes("user denied") ||
      message.includes("Port disconnected") ||
      message.includes("Event handler of") ||
      message.includes("runtime.lastError") ||
      message.includes("Unable to determine contract standard") ||
      message.includes("Unsupported chainId") ||
      message.includes("CAIP stream error")
    ) {
      // Suppress these expected errors/warnings - they're MetaMask internal noise
      return;
    }
    
    // Allow other errors through
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || "";
    
    // Filter out MetaMask internal warnings
    if (
      message.includes("Port disconnected") ||
      message.includes("Event handler of") ||
      message.includes("runtime.lastError") ||
      message.includes("Unable to determine contract standard") ||
      message.includes("Unsupported chainId") ||
      message.includes("CAIP stream error") ||
      message.includes("back/forward cache")
    ) {
      // Suppress MetaMask internal warnings
      return;
    }
    
    // Allow other warnings through
    originalWarn.apply(console, args);
  };

  // Also handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const message = event.reason?.message || event.reason?.toString() || "";
    
    // Suppress expected MetaMask rejections
    if (
      message.includes("not been authorized") ||
      message.includes("User denied transaction signature") ||
      message.includes("user rejected") ||
      message.includes("user denied") ||
      message.includes("Port disconnected") ||
      (event.reason?.code === 4001) // User rejection code
    ) {
      event.preventDefault(); // Prevent console error
      return;
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
