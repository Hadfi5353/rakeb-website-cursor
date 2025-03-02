
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Car, LogIn, UserPlus, LayoutDashboard, User, LogOut, HelpCircle, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileMenuProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  getInitials: (user: any) => string;
}

export const MobileMenu = memo(({ user, isOpen, onClose, onSignOut, getInitials }: MobileMenuProps) => {
  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[100] md:hidden will-change-transform transform-gpu transition-all duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity transform-gpu ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl transform-gpu transition-transform duration-200 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {user ? (
            <div className="px-6 py-6">
              <div className="flex items-center space-x-3 mb-6">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.first_name} />
                  <AvatarFallback>{getInitials(user)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                <Link
                  to="/dashboard/owner"
                  onClick={onClose}
                  className="flex items-center w-full space-x-2 p-3 rounded-lg hover:bg-gray-50"
                >
                  <LayoutDashboard className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Tableau de bord</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex items-center w-full space-x-2 p-3 rounded-lg hover:bg-gray-50"
                >
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Mon profil</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full space-x-2 p-3 rounded-lg hover:bg-gray-50 text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </nav>
            </div>
          ) : (
            <div className="pt-20 px-6 pb-6 space-y-4">
              <Link 
                to="/become-owner" 
                onClick={onClose}
                className="w-full"
              >
                <Button className="w-full" variant="outline">
                  <Car className="w-4 h-4 mr-2" />
                  Devenir propriétaire
                </Button>
              </Link>
              <Link 
                to="/auth/login" 
                onClick={onClose}
                className="w-full"
              >
                <Button className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              </Link>
              <Link 
                to="/auth/register" 
                onClick={onClose}
                className="w-full"
              >
                <Button className="w-full" variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Inscription
                </Button>
              </Link>
            </div>
          )}
          <div className="flex-1 px-6 pb-6">
            <nav className="space-y-2">
              {[
                { to: "/how-it-works", icon: HelpCircle, text: "Comment ça marche" },
                { to: "/contact", icon: MessageCircle, text: "Contact" },
                { to: "/legal", icon: Shield, text: "Légal" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className="flex items-center w-full space-x-2 p-3 rounded-lg hover:bg-gray-50"
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
  );
});

MobileMenu.displayName = "MobileMenu";
