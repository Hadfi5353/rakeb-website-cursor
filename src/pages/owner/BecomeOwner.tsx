
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Check, ArrowRight } from "lucide-react";

const BecomeOwner = () => {
  const benefits = [
    {
      title: "Gagnez de l'argent",
      description: "Rentabilisez votre véhicule lorsque vous ne l'utilisez pas"
    },
    {
      title: "Flexibilité totale",
      description: "Choisissez vos disponibilités et vos tarifs"
    },
    {
      title: "Couverture assurance",
      description: "Profitez d'une assurance tous risques pendant les locations"
    },
    {
      title: "Support dédié",
      description: "Une équipe à votre écoute 7j/7 pour vous accompagner"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 to-white pt-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Devenez propriétaire sur Rakeb
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Rentabilisez votre véhicule et rejoignez la communauté Rakeb.
              Gagnez de l'argent en toute simplicité.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/auth/register">
                  Commencer maintenant
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 -mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
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
              Prêt à nous rejoindre ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Créez votre compte propriétaire en quelques minutes et commencez à gagner de l'argent.
            </p>
            <Button asChild size="lg">
              <Link to="/auth/register">Devenir propriétaire</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeOwner;
