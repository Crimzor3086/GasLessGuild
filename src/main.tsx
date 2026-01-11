import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress expected MetaMask console errors
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || "";
    
    // Filter out expected MetaMask errors
    if (
      message.includes("not been authorized") ||
      message.includes("User denied transaction signature") ||
      message.includes("user rejected") ||
      message.includes("user denied")
    ) {
      // Suppress these expected errors - they're handled in UI
      return;
    }
    
    // Allow other errors through
    originalError.apply(console, args);
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
      (event.reason?.code === 4001) // User rejection code
    ) {
      event.preventDefault(); // Prevent console error
      return;
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
