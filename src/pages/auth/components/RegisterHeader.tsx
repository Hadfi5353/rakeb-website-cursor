
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function RegisterHeader() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Link to="/" className="flex items-center text-sm text-gray-600 mb-8 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Link>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Créez votre compte</h2>
        <p className="mt-2 text-gray-600">
          Déjà inscrit ?{" "}
          <Link to="/auth/login" className="text-primary hover:text-primary-dark transition-colors">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
