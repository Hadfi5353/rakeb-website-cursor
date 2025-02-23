
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Car, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary font-medium" : "text-gray-600";
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              <Car className="h-8 w-8 text-primary" />
              <span>Rakeb</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a 
              href="#how-it-works" 
              className={`${isActive('/#how-it-works')} hover:text-primary transition-colors py-2`}
            >
              Comment ça marche
            </a>
            <a 
              href="#popular" 
              className={`${isActive('/#popular')} hover:text-primary transition-colors py-2`}
            >
              Véhicules populaires
            </a>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/cars/add">
                  <Button variant="outline" size="sm" className="border-primary hover:bg-primary hover:text-white">
                    <Car className="w-4 h-4 mr-2" />
                    Mettre en location
                  </Button>
                </Link>
                <div className="h-6 w-px bg-gray-200" />
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                    <User className="w-4 h-4 mr-2" />
                    Mon Profil
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-gray-600 hover:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/cars/add">
                  <Button variant="outline" size="sm" className="border-primary hover:bg-primary hover:text-white">
                    <Car className="w-4 h-4 mr-2" />
                    Mettre en location
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="sm" className="bg-primary hover:bg-primary-dark text-white">
                    <User className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden animate-slideIn">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-100">
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Comment ça marche
            </a>
            <a
              href="#popular"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Véhicules populaires
            </a>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="space-y-2 px-3">
                  <Link to="/cars/add" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-primary hover:bg-primary hover:text-white">
                      <Car className="w-4 h-4 mr-2" />
                      Mettre en location
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full text-gray-600 hover:text-primary">
                      <User className="w-4 h-4 mr-2" />
                      Mon Profil
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }} 
                    variant="ghost" 
                    className="w-full text-gray-600 hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Link to="/cars/add" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-primary hover:bg-primary hover:text-white">
                      <Car className="w-4 h-4 mr-2" />
                      Mettre en location
                    </Button>
                  </Link>
                  <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary-dark">
                      <User className="w-4 h-4 mr-2" />
                      Se connecter
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
