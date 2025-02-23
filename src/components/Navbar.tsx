
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  Car,
  User,
  MessageCircle,
  Shield,
  Info,
  Settings,
  LogIn,
  UserPlus,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold"
          >
            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Rakeb
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cars/add">
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
              >
                <Car className="w-4 h-4 mr-2" />
                Devenir propriétaire
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="border border-gray-200 rounded-full p-2 hover:shadow-md transition-all duration-200"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem asChild>
                  <Link to="/auth/login" className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Connexion</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auth/register" className="cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Inscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/cars/add" className="cursor-pointer">
                    <Car className="mr-2 h-4 w-4" />
                    <span>Devenir propriétaire</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/how-it-works" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Comment fonctionne Rakeb</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="cursor-pointer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Contacter le service client</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/legal" className="cursor-pointer">
                    <Info className="mr-2 h-4 w-4" />
                    <span>Informations légales</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/insurance" className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Assurance et protection</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tools" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Outils pour les hôtes</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1"
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
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="pt-20 px-6 pb-6 space-y-4">
                <Link to="/cars/add" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" variant="outline">
                    <Car className="w-4 h-4 mr-2" />
                    Devenir propriétaire
                  </Button>
                </Link>
                <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Inscription
                  </Button>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <nav className="space-y-2">
                  {[
                    { to: "/how-it-works", icon: HelpCircle, text: "Comment fonctionne Rakeb" },
                    { to: "/contact", icon: MessageCircle, text: "Contacter le service client" },
                    { to: "/legal", icon: Info, text: "Informations légales" },
                    { to: "/insurance", icon: Shield, text: "Assurance et protection" },
                    { to: "/tools", icon: Settings, text: "Outils pour les hôtes" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{item.text}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
