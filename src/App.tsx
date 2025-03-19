import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import RoleRoute from "@/components/RoleRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmailProcessor from "./components/EmailProcessor";

import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import NotFound from "./pages/NotFound";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import RenterDashboard from "./pages/dashboard/RenterDashboard";
import Profile from "./pages/profile/Profile";
import AddCar from "./pages/cars/AddCar";
import CarDetail from "./pages/cars/CarDetail";
import SearchResults from "./pages/cars/SearchResults";
import BecomeOwner from "./pages/owner/BecomeOwner";
import HowItWorks from "./pages/how-it-works/HowItWorks";
import Contact from "./pages/contact/Contact";
import Legal from "./pages/legal/Legal";
import Privacy from "./pages/legal/Privacy";
import Insurance from "./pages/legal/Insurance";
import OwnerTools from "./pages/owner/OwnerTools";
import DocumentVerification from "./pages/documents/DocumentVerification";
import ReservationPage from "./pages/cars/ReservationPage";
import Settings from "./pages/settings/Settings";
import Notifications from "./pages/notifications/Notifications";
import OwnerVehicles from "./pages/dashboard/OwnerVehicles";
import EmailDashboard from "./pages/admin/EmailDashboard";
import OwnerBookingsDashboard from "./pages/dashboard/OwnerBookingsDashboard";
import RenterBookingsDashboard from "./pages/dashboard/RenterBookingsDashboard";
import BookingDetailsPage from "./pages/bookings/BookingDetailsPage";
import BeforeOwner from "@/pages/owner/BeforeOwner";
import Favorites from "@/pages/favorites/Favorites";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router basename="/rakeb-website-cursor">
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/auth/change-password" element={<ChangePassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cars/search" element={<SearchResults />} />
                  <Route path="/cars/:id" element={<CarDetail />} />
                  
                  <Route
                    path="/owner/dashboard"
                    element={
                      <RoleRoute allowedRoles={['owner']}>
                        <OwnerDashboard />
                      </RoleRoute>
                    }
                  />
                  
                  <Route
                    path="/dashboard"
                    element={
                      <RoleRoute allowedRoles={['renter']}>
                        <RenterDashboard />
                      </RoleRoute>
                    }
                  />
                  
                  <Route
                    path="/cars/add"
                    element={
                      <RoleRoute allowedRoles={['owner']}>
                        <AddCar />
                      </RoleRoute>
                    }
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Toaster />
              <EmailProcessor />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
