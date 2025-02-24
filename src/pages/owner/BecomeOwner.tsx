
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, 
  Calendar, 
  Settings, 
  UserCheck, 
  DollarSign, 
  Shield, 
  Clock, 
  HeadphonesIcon,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";

const steps = [
  {
    title: "Inscription gratuite du véhicule",
    description: "Inscrivez votre voiture en quelques minutes sans aucun frais. Tous les types de véhicules sont acceptés, qu'il s'agisse de berlines, SUV ou voitures de luxe.",
    icon: Car,
  },
  {
    title: "Définissez vos conditions",
    description: "Fixez vos propres tarifs, disponibilités et règles. Vous avez un contrôle total sur la manière dont votre véhicule est partagé.",
    icon: Settings,
  },
  {
    title: "Accueillez les locataires",
    description: "Recevez des réservations, communiquez facilement avec les locataires via notre plateforme et organisez des remises de clés en toute simplicité.",
    icon: UserCheck,
  },
  {
    title: "Recevez vos paiements rapidement",
    description: "Gagnez jusqu'à 75% du prix de chaque location, avec des paiements effectués par dépôt direct dans les 3 jours suivant la fin de la location.",
    icon: DollarSign,
  },
];

const benefits = [
  {
    title: "Revenus supplémentaires",
    description: "Générez un revenu mensuel moyen de 712 $* en partageant votre voiture.",
    icon: DollarSign,
  },
  {
    title: "Assurance complète",
    description: "Bénéficiez d'une couverture responsabilité civile allant jusqu'à 2 000 000 $ et d'une protection contre les dommages matériels sans franchise.",
    icon: Shield,
  },
  {
    title: "Flexibilité totale",
    description: "Vous décidez quand et à qui vous louez votre véhicule, avec la possibilité de bloquer des dates à tout moment.",
    icon: Calendar,
  },
  {
    title: "Support 24/7",
    description: "Notre équipe d'assistance est disponible à toute heure pour répondre à vos questions et vous aider en cas de besoin.",
    icon: HeadphonesIcon,
  },
];

const BecomeOwner = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-white pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Gagnez de l'argent en partageant votre voiture avec Rakeb
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transformez votre véhicule inutilisé en source de revenus dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
                <Link to="/cars/add">
                  Inscrivez votre voiture
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/how-it-works">
                  Comment ça marche ?
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques flottantes */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-medium grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">712 €</div>
                <div className="text-gray-600">Revenu mensuel moyen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2M €</div>
                <div className="text-gray-600">Couverture d'assurance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Support client</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comment devenir propriétaire ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un processus simple et transparent en quelques étapes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-visible animate-fadeIn" style={{ animationDelay: `${index * 200}ms` }}>
                <CardContent className="p-6">
                  <div className="absolute -top-6 left-6 w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
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

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Pourquoi choisir Rakeb ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des avantages exclusifs pour nos propriétaires
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg bg-white shadow-soft hover:shadow-medium transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Une expérience propriétaire sans stress
              </h2>
              <p className="text-gray-600">
                Nous avons pensé à tout pour vous faciliter la vie
              </p>
            </div>

            <div className="space-y-6">
              {[
                "Vérification d'identité de tous les locataires",
                "Assistance routière incluse",
                "Paiements sécurisés et garantis",
                "Application mobile intuitive",
                "Gestion flexible de votre calendrier",
                "Photos professionnelles de votre véhicule",
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-soft animate-slideIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Prêt à commencer l'aventure ?
            </h2>
            <p className="text-gray-600 mb-8">
              Rejoignez notre communauté de propriétaires et commencez à générer des revenus avec votre véhicule
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
              <Link to="/cars/add">
                Inscrivez votre voiture maintenant
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
