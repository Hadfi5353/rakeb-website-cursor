
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Star, MapPin, User, Shield, Coffee, Key } from "lucide-react";

const CarDetail = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Ces données viendront d'une API dans une implémentation réelle
  const car = {
    id: 1,
    name: "Dacia Duster",
    image: "/placeholder.svg",
    price: "250",
    location: "Casablanca",
    rating: 4.8,
    reviews: 24,
    description: "SUV parfait pour vos aventures, spacieux et économique.",
    features: [
      "Bluetooth",
      "Climatisation",
      "GPS",
      "5 places",
      "Diesel",
      "Boîte manuelle"
    ],
    owner: {
      name: "Mohammed A.",
      image: "/placeholder.svg",
      rating: 4.9,
      joined: "2023"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Images et Infos principales */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors">
              ← Retour aux résultats
            </Link>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-96 object-cover"
              />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
                    <div className="flex items-center mt-2">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{car.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-primary/5 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="ml-1 text-sm font-medium text-primary">{car.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{car.description}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <div className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center mr-3">
                        <Coffee className="w-4 h-4 text-primary" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Réservation et Propriétaire */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {car.price} Dh <span className="text-sm font-normal text-gray-600">/jour</span>
                </div>

                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border mb-4"
                />

                <Button className="w-full mb-4">
                  Réserver maintenant
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Réservation instantanée et sécurisée
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={car.owner.image}
                      alt={car.owner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{car.owner.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {car.owner.rating} · Membre depuis {car.owner.joined}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Contacter le propriétaire
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
