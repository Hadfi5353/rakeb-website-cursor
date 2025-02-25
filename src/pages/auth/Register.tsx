import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Car, Search, Shield, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";

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

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-tr from-gray-50 via-white to-gray-50 relative">
      <div className="absolute top-0 left-0 p-6 z-10">
        <Link to="/" className="group inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Retour
        </Link>
      </div>

      <div className="h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center pb-6 relative">
            <div className="mx-auto w-fit mb-4">
              <Car className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Créez votre compte Rakeb
            </CardTitle>
            <CardDescription className="text-base">
              Déjà inscrit ?{" "}
              <Link to="/auth/login" className="text-primary hover:text-primary-dark transition-colors font-medium">
                Connectez-vous
              </Link>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
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

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-4 bg-white text-gray-500">Ou continuer avec</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" type="button">
                        <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                        Google
                      </Button>
                      <Button variant="outline" className="w-full" type="button">
                        <img src="https://authjs.dev/img/providers/facebook.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                        Facebook
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-gray-500 text-center md:text-left">
                    En vous inscrivant, vous acceptez nos{" "}
                    <Link to="/legal" className="text-primary hover:text-primary-dark">
                      Conditions
                    </Link>{" "}
                    et notre{" "}
                    <Link to="/legal/privacy" className="text-primary hover:text-primary-dark">
                      Politique de confidentialité
                    </Link>
                  </p>
                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto min-w-[200px]">
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 mt-4">
              <Shield className="w-4 h-4" />
              <span>Inscription sécurisée via SSL</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
