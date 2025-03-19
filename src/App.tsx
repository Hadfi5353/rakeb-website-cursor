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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" />
        <AuthProvider>
          <Router basename="/rakeb-website-cursor">
            <div className="min-h-screen bg-background">
              <Navbar />
              <EmailProcessor />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/auth/change-password" element={<ChangePassword />} />
                  <Route 
                    path="/dashboard/renter" 
                    element={
                      <RoleRoute allowedRoles={['renter']}>
                        <RenterDashboard />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/owner" 
                    element={
                      <RoleRoute allowedRoles={['owner']}>
                        <OwnerDashboard />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/owner/vehicles" 
                    element={
                      <RoleRoute allowedRoles={['owner']}>
                        <OwnerVehicles />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/owner/bookings" 
                    element={
                      <RoleRoute allowedRoles={['owner']}>
                        <OwnerBookingsDashboard />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/renter/bookings" 
                    element={
                      <RoleRoute allowedRoles={['renter']}>
                        <RenterBookingsDashboard />
                      </RoleRoute>
                    } 
                  />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route 
                    path="/cars/add" 
                    element={
                      <RoleRoute allowedRoles={['owner', 'admin']}>
                        <AddCar />
                      </RoleRoute>
                    } 
                  />
                  <Route path="/cars/:id" element={<CarDetail />} />
                  <Route path="/cars/:id/reserve" element={<ReservationPage />} />
                  <Route path="/before-owner" element={<BeforeOwner />} />
                  <Route path="/become-owner" element={<BecomeOwner />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/legal/privacy" element={<Privacy />} />
                  <Route path="/legal/insurance" element={<Insurance />} />
                  <Route path="/owner/tools" element={<OwnerTools />} />
                  <Route path="/documents/verification" element={<DocumentVerification />} />
                  <Route 
                    path="/bookings/:id" 
                    element={
                      <RoleRoute allowedRoles={['renter', 'owner']}>
                        <BookingDetailsPage />
                      </RoleRoute>
                    } 
                  />
                  <Route 
                    path="/admin/emails" 
                    element={
                      <RoleRoute allowedRoles={['admin']}>
                        <EmailDashboard />
                      </RoleRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
