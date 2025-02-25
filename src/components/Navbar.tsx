
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-primary">
            Rakeb
          </Link>

          {/* Menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/how-it-works" className="text-gray-600 hover:text-primary">
              Comment ça marche
            </Link>
            <Link to="/cars/add" className="text-gray-600 hover:text-primary">
              Mettre en location
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white border border-gray-200 shadow-lg rounded-lg mt-2 w-56"
              >
                <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer">
                  <Link to="/profile" className="w-full py-2">
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer">
                  <Link to="/dashboard" className="w-full py-2">
                    Tableau de bord
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer text-red-600">
                  <button className="w-full text-left py-2">
                    Déconnexion
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Menu mobile overlay */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/how-it-works" 
                className="text-gray-600 hover:text-primary py-2"
                onClick={() => setIsOpen(false)}
              >
                Comment ça marche
              </Link>
              <Link 
                to="/cars/add" 
                className="text-gray-600 hover:text-primary py-2"
                onClick={() => setIsOpen(false)}
              >
                Mettre en location
              </Link>
              <Link 
                to="/profile" 
                className="text-gray-600 hover:text-primary py-2"
                onClick={() => setIsOpen(false)}
              >
                Mon profil
              </Link>
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-primary py-2"
                onClick={() => setIsOpen(false)}
              >
                Tableau de bord
              </Link>
              <button className="text-left text-red-600 hover:text-red-700 py-2">
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
