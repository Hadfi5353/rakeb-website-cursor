
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { NavLogo } from "./navbar/NavLogo";
import { DesktopMenu } from "./navbar/DesktopMenu";
import { MobileMenu } from "./navbar/MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const getInitials = (user: any) => {
    const firstName = user?.user_metadata?.first_name || '';
    const lastName = user?.user_metadata?.last_name || '';
    return (firstName[0] + lastName[0]).toUpperCase();
  };

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLogo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/become-owner">
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
              >
                <Car className="w-4 h-4 mr-2" />
                Devenir propriétaire
              </Button>
            </Link>
            <DesktopMenu user={user} onSignOut={handleSignOut} getInitials={getInitials} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-1"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? 
                <X className="h-6 w-6 text-gray-600" /> : 
                <Menu className="h-6 w-6 text-gray-600" />
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSignOut={handleSignOut}
        getInitials={getInitials}
      />
    </nav>
  );
};

export default Navbar;
