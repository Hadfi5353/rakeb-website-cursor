import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Car, User } from 'lucide-react';

interface LocationState {
  defaultRole?: 'owner' | 'renter';
}

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { defaultRole } = (location.state as LocationState) || {};
  const { signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: defaultRole || 'renter'
  });

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers la page appropriée
    if (user) {
      if (formData.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate, formData.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.role) {
      toast.error('Veuillez sélectionner un rôle');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role
          }
        }
      });

      if (success) {
        toast.success('Inscription réussie !');
        if (formData.role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 mb-6">
            <Label className="text-base">Je souhaite m'inscrire en tant que :</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all ${
                  formData.role === 'renter' ? 'border-primary ring-2 ring-primary' : ''
                }`}
                onClick={() => setFormData({ ...formData, role: 'renter' })}
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <User className="w-8 h-8 mb-2" />
                  <span className="font-medium">Locataire</span>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${
                  formData.role === 'owner' ? 'border-primary ring-2 ring-primary' : ''
                }`}
                onClick={() => setFormData({ ...formData, role: 'owner' })}
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Car className="w-8 h-8 mb-2" />
                  <span className="font-medium">Propriétaire</span>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate('/auth/login')}
            >
              Se connecter
            </Button>
          </p>
        </form>
      </div>
    </div>
  );
}
