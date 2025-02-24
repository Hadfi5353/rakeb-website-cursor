
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, ArrowRight, Check } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Inscrivez-vous",
      description: "Créez votre compte Rakeb en quelques clics",
    },
    {
      title: "Trouvez votre véhicule",
      description: "Parcourez notre sélection de véhicules disponibles",
    },
    {
      title: "Réservez",
      description: "Choisissez vos dates et réservez en ligne",
    },
    {
      title: "Profitez",
      description: "Récupérez votre véhicule et profitez de votre trajet",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 to-white pt-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comment fonctionne Rakeb ?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Rakeb simplifie la location de véhicules entre particuliers. 
              Découvrez comment ça marche en quelques étapes simples.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/auth/register">
                  Commencer maintenant
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  Contactez-nous
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container mx-auto px-4 -mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 mt-32 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <Car className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Prêt à commencer l'aventure ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rejoignez Rakeb aujourd'hui et découvrez une nouvelle façon de louer des véhicules.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/auth/register">S'inscrire</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/become-owner">Devenir propriétaire</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
