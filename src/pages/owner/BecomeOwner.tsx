import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { 
  Car, 
  Calendar,
  Settings,
  User,
  DollarSign,
  Shield,
  Clock,
  Headset,
  ArrowRight,
  CheckCircle,
  CircleDollarSign,
  Key,
  CheckCircle2,
  Calculator,
  Users
} from "lucide-react";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateRole } from '@/hooks/useUpdateRole';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const steps = [
  {
    title: "Inscription simple et rapide",
    description: "Créez votre compte et ajoutez votre véhicule en quelques minutes. Notre équipe vous accompagne à chaque étape.",
    icon: Key,
  },
  {
    title: "Gérez vos locations",
    description: "Définissez vos tarifs, vos disponibilités et vos conditions de location en toute liberté.",
    icon: Settings,
  },
  {
    title: "Rencontrez vos locataires",
    description: "Acceptez les demandes qui vous conviennent et organisez les remises de clés selon vos préférences.",
    icon: Users,
  },
  {
    title: "Recevez vos gains",
    description: "Les paiements sont sécurisés et versés directement sur votre compte dans les 24h suivant la location.",
    icon: CircleDollarSign,
  },
];

const benefits = [
  {
    title: "Revenus attractifs",
    description: "Gagnez en moyenne 6 000 DH par mois en louant votre véhicule régulièrement.",
    icon: DollarSign,
  },
  {
    title: "Protection maximale",
    description: "Votre véhicule est assuré jusqu'à 20 millions de DH avec une couverture tous risques incluse.",
    icon: Shield,
  },
  {
    title: "Flexibilité totale",
    description: "Gardez le contrôle total sur votre planning et vos conditions de location.",
    icon: Calendar,
  },
  {
    title: "Support dédié",
    description: "Une équipe locale disponible 7j/7 pour vous accompagner en français et en arabe.",
    icon: Headset,
  },
];

const BecomeOwner = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { updateRole, isLoading: updateLoading } = useUpdateRole();
  const navigate = useNavigate();
  const [daysPerMonth, setDaysPerMonth] = useState(15);
  const [pricePerDay, setPricePerDay] = useState(300);
  const [carValue, setCarValue] = useState(150000);

  const calculateMonthlyRevenue = () => {
    return daysPerMonth * pricePerDay;
  };

  const calculateAnnualRevenue = () => {
    return calculateMonthlyRevenue() * 12;
  };

  const monthlyRevenue = calculateMonthlyRevenue();
  const annualRevenue = calculateAnnualRevenue();

  const handleBecomeOwner = async () => {
    if (!user) {
      navigate('/auth/register', { state: { defaultRole: 'owner' } });
      return;
    }

    const success = await updateRole('owner');
    if (success) {
      navigate('/owner/dashboard');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section avec fond dégradé */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-white pt-32 pb-40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-8">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Plus de 1 000 propriétaires nous font confiance</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rentabilisez votre voiture avec Rakeb
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Gagnez jusqu'à 6 000 DH par mois en toute sécurité en partageant votre véhicule quand vous ne l'utilisez pas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark" onClick={handleBecomeOwner} disabled={authLoading || updateLoading}>
                <Link to="/cars/add">
                  {updateLoading ? 'Traitement en cours...' : 'Inscrire mon véhicule'}
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('revenue-calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Link to="#revenue-calculator">
                  Calculer mes revenus
                  <Calculator className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques avec design moderne */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">6 000 DH</div>
                <div className="text-gray-600">Revenu mensuel moyen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">20M DH</div>
                <div className="text-gray-600">Couverture d'assurance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Support client local</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold">Processus simplifié</span>
            <h2 className="text-3xl font-bold mt-2 mb-4">
              Commencez en quelques minutes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une expérience fluide et transparente du début à la fin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-visible bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="absolute -top-6 left-6 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages avec design moderne */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold">Nos avantages</span>
            <h2 className="text-3xl font-bold mt-2 mb-4">
              Pourquoi choisir Rakeb ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour rentabiliser votre véhicule en toute sérénité
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-white hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des fonctionnalités */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-semibold">Tout inclus</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                Une expérience propriétaire sans souci
              </h2>
              <p className="text-gray-600">
                Nous avons pensé à tout pour vous faciliter la vie
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Vérification d'identité de tous les locataires",
                "Assistance routière 24h/24 dans tout le Maroc",
                "Paiements sécurisés et garantis",
                "Application mobile intuitive",
                "Gestion flexible de votre calendrier",
                "Photos professionnelles de votre véhicule",
                "Assurance tous risques incluse",
                "Support client en arabe et en français",
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-24 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Témoignages</h2>
          <p className="text-gray-600">Chargement des témoignages...</p>
        </div>
      </section>

      {/* Calculateur de revenus */}
      <section id="revenue-calculator" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-primary font-semibold">Simulateur de revenus</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                Calculez vos revenus potentiels
              </h2>
              <p className="text-gray-600">
                Estimez rapidement combien vous pourriez gagner en louant votre véhicule sur Rakeb
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardContent className="space-y-8 pt-4">
                  <div className="space-y-4">
                    <Label>Valeur de votre véhicule</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[carValue]}
                        onValueChange={(value) => setCarValue(value[0])}
                        max={500000}
                        step={10000}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold min-w-[100px] text-right">
                        {carValue.toLocaleString()} DH
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Prix par jour</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[pricePerDay]}
                        onValueChange={(value) => setPricePerDay(value[0])}
                        max={1000}
                        step={50}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold min-w-[100px] text-right">
                        {pricePerDay} DH
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Jours de location par mois</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[daysPerMonth]}
                        onValueChange={(value) => setDaysPerMonth(value[0])}
                        max={30}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold min-w-[100px] text-right">
                        {daysPerMonth} jours
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="space-y-8 pt-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {monthlyRevenue.toLocaleString()} DH
                    </div>
                    <div className="text-gray-600">Revenus mensuels estimés</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {annualRevenue.toLocaleString()} DH
                    </div>
                    <div className="text-gray-600">Revenus annuels estimés</div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Assurance tous risques incluse</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Paiements sécurisés garantis</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Support client 24/7</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" asChild>
                    <Link to="/cars/add">
                      Commencer maintenant
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <FAQ />
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Prêt à rentabiliser votre voiture ?
            </h2>
            <p className="text-gray-600 mb-8">
              Rejoignez notre communauté de propriétaires et commencez à générer des revenus dès maintenant
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
              <Link to="/cars/add">
                Inscrire mon véhicule
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeOwner;
