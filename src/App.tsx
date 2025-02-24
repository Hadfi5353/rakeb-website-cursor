
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";

import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard/owner" element={<OwnerDashboard />} />
            <Route path="/dashboard/renter" element={<RenterDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cars/add" element={<AddCar />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/cars/:id/reserve" element={<ReservationPage />} />
            <Route path="/become-owner" element={<BecomeOwner />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/insurance" element={<Insurance />} />
            <Route path="/owner/tools" element={<OwnerTools />} />
            <Route path="/documents/verification" element={<DocumentVerification />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
