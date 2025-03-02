
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Car, Search, Shield, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "renter" as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role
      );
      navigate('/auth/login');
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Accédez à des milliers de véhicules dans tout le Maroc",
    "Réservez rapidement et en toute sécurité",
    "Gagnez de l'argent en partageant votre véhicule",
    "Support client disponible 24/7"
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Image with overlay */}
      <div className="relative w-full md:w-1/2 bg-primary-dark min-h-[30vh] md:min-h-screen">
        <img 
          src="/lovable-uploads/82c1e5bd-e916-4e57-9839-1a1a9e3204a5.png" 
          alt="Peer to peer car rental" 
          className="w-full h-full object-cover opacity-30 absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/70"></div>
        
        <div className="absolute top-0 left-0 p-6">
          <Link to="/" className="group inline-flex items-center text-white font-medium hover:text-white/90 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
            Retour
          </Link>
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-center px-8 py-12 text-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold mb-6">Rejoignez la communauté Rakeb</h2>
            <p className="text-lg mb-8 text-white/80">La plateforme de location de voitures entre particuliers au Maroc</p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-light flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Registration form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white">
        <Card className="w-full max-w-md bg-white shadow-md border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-fit mb-2">
              <Car className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Créez votre compte
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Déjà inscrit ?{" "}
              <Link to="/auth/login" className="text-primary hover:text-primary-dark transition-colors font-medium">
                Connectez-vous
              </Link>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Prénom"
                    className="pl-10"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Nom"
                    className="pl-10"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Je suis un</label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.role === "renter" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, role: "renter" })}
                    className="w-full"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Locataire
                  </Button>
                  <Button
                    type="button"
                    variant={formData.role === "owner" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, role: "owner" })}
                    className="w-full"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Propriétaire
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les{" "}
                  <Link to="/legal" className="text-primary hover:text-primary-dark underline">
                    Conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link to="/legal/privacy" className="text-primary hover:text-primary-dark underline">
                    Politique de confidentialité
                  </Link>
                </label>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !agreeToTerms} 
                className="w-full py-6 text-base font-semibold"
              >
                {isLoading ? "Inscription en cours..." : "Créer mon compte"}
              </Button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-3 text-gray-400 text-sm">ou continuer avec</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" type="button">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  <svg className="w-5 h-5 mr-2 text-blue-600" viewBox="0 0 24 24">
                    <path
                      d="M9.03954 11.0141C9.03954 8.41642 10.8719 7.42261 12.7804 7.42261C13.7935 7.42261 14.6066 7.80087 15.1866 8.28543L17.0384 6.45043C15.8647 5.36739 14.3592 4.67651 12.7804 4.67651C9.74692 4.67651 6.97341 7.06208 6.97341 11.0141C6.97341 14.9661 9.74692 17.3516 12.7804 17.3516C14.4489 17.3516 15.8647 16.7501 16.9487 15.5776C18.1224 14.4051 18.5125 12.7489 18.5125 11.3834C18.5125 10.7818 18.4446 10.3036 18.3467 9.92532H12.7804V12.5625H16.0018C15.8647 13.5068 15.3644 14.2472 14.7146 14.7318C14.1844 15.1506 13.4154 15.5199 12.7804 15.5199C10.5514 15.5199 9.03954 13.7934 9.03954 11.0141Z"
                      fill="currentColor"
                    />
                  </svg>
                  Facebook
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 mt-4">
                <Shield className="w-4 h-4" />
                <span>Inscription sécurisée via SSL</span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
