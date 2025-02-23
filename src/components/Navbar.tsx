
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Car, User, Home, Star, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const mainNavItems = [
    { label: "Accueil", href: "/", icon: Home },
    { label: "Explorer", href: "/explorer", icon: Search },
    { label: "Véhicules populaires", href: "/offres", icon: Star },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold"
            >
              <Car className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Rakeb
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Main Navigation Items */}
            <div className="flex space-x-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Devenir propriétaire
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="p-2">
                    <h3 className="text-sm font-medium mb-2">Commencez à louer votre voiture</h3>
                    <p className="text-xs text-gray-500 mb-2">Gagnez jusqu'à 5000 DH par mois</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/cars/add" className="cursor-pointer">
                      <Car className="mr-2 h-4 w-4" />
                      <span>Ajouter une voiture</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/owner/guide" className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Guide du propriétaire</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {user ? (
                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  Mon compte
                </Button>
              ) : (
                <Link to="/auth/login">
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary-dark text-white transition-colors duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-slideIn">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  location.pathname === item.href
                    ? "text-primary bg-primary/5"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                } transition-colors duration-200 text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-2 px-3">
                <Link to="/cars/add" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    <Car className="w-4 h-4 mr-2" />
                    Devenir propriétaire
                  </Button>
                </Link>

                {user ? (
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-primary"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mon compte
                  </Button>
                ) : (
                  <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                      <User className="w-4 h-4 mr-2" />
                      Se connecter
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
