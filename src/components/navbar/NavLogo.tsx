import { Link } from "react-router-dom";
import { Car } from "lucide-react";

export const NavLogo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center justify-center md:justify-start space-x-2 text-xl sm:text-2xl font-bold"
    >
      <Car className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
      <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
        Rakeb
      </span>
    </Link>
  );
};
