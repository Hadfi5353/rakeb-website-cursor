
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Rakeb
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">
              Comment ça marche
            </a>
            <a href="#popular" className="text-gray-600 hover:text-primary transition-colors">
              Véhicules populaires
            </a>
            <Button variant="outline" className="mr-2 border-primary hover:bg-primary/5">
              Mettre en location
            </Button>
            <Button className="bg-primary hover:bg-primary-dark transition-colors">
              Se connecter
            </Button>
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden animate-slideIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-100 shadow-soft">
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              Comment ça marche
            </a>
            <a
              href="#popular"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              Véhicules populaires
            </a>
            <div className="flex flex-col space-y-2 p-3">
              <Button variant="outline" className="w-full border-primary hover:bg-primary/5">
                Mettre en location
              </Button>
              <Button className="w-full bg-primary hover:bg-primary-dark transition-colors">
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
