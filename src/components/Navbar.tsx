
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/components/SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="fixed w-full z-50">
      {/* Barre principale */}
      <nav className="relative bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold"
            >
              <Car className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Rakeb
              </span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Bouton Devenir Hôte */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Devenir Hôte
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent">
                    <h3 className="text-lg font-semibold mb-2">Gagnez de l'argent avec votre voiture</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Rejoignez notre communauté d'hôtes et gagnez jusqu'à 5000 DH par mois.
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/cars/add" className="cursor-pointer">
                        <Car className="mr-2 h-4 w-4" />
                        <span>Ajouter une voiture</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tools" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Outils pour les hôtes</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menu Profil */}
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
                  {!user ? (
                    <DropdownMenuGroup>
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
                    </DropdownMenuGroup>
                  ) : (
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/how-it-works" className="cursor-pointer">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Comment ça marche</span>
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
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bouton Menu Mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section avec image d'arrière-plan */}
      {location.pathname === "/" && (
        <div 
          className="relative py-24 bg-cover bg-center min-h-[600px] flex items-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('/background-hero.jpg')"
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center text-white mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Trouvez la voiture parfaite<br />pour votre prochain voyage
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 font-light">
                Location de voitures entre particuliers partout au Maroc
              </p>
            </div>
            <div className="relative z-10">
              <SearchBar />
            </div>
          </div>
        </div>
      )}

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  {!user ? (
                    <div className="space-y-2">
                      <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full" variant="default">Connexion</Button>
                      </Link>
                      <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full" variant="outline">Inscription</Button>
                      </Link>
                    </div>
                  ) : (
                    <Button onClick={handleSignOut} className="w-full">Se déconnecter</Button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  <nav className="px-4 py-2 space-y-1">
                    <Link
                      to="/cars/add"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <Car className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Devenir Hôte</span>
                    </Link>
                    {/* Autres liens du menu mobile */}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
