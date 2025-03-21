import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import SupabaseProvider from "./lib/supabase/supabase-provider";
import { StripeProvider } from '@/providers/StripeProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SupabaseProvider>
          <AuthProvider>
            <StripeProvider>
              <BrowserRouter>
                <Toaster />
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <AppRoutes />
                </div>
              </BrowserRouter>
            </StripeProvider>
          </AuthProvider>
        </SupabaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
