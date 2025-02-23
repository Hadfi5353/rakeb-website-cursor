
import { Car, MapPin, Star, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cars = [
  {
    id: 1,
    name: "Dacia Duster",
    image: "/placeholder.svg",
    price: "250",
    location: "Casablanca",
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    name: "Renault Clio",
    image: "/placeholder.svg",
    price: "200",
    location: "Rabat",
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 3,
    name: "Volkswagen Golf",
    image: "/placeholder.svg",
    price: "300",
    location: "Marrakech",
    rating: 4.7,
    reviews: 32,
  },
];

const PopularCars = () => {
  return (
    <section id="popular" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Véhicules populaires
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les véhicules les plus appréciés par notre communauté
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <Card 
              key={car.id} 
              className="overflow-hidden hover:shadow-medium transition-all duration-300 animate-fadeIn border-gray-100"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader className="p-0">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
                  <div className="flex items-center bg-primary/5 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="ml-1 text-sm font-medium text-primary">{car.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                  <span className="text-sm">{car.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-primary/70" />
                  <span className="text-sm">{car.reviews} avis</span>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary">{car.price} Dh</span>
                    <span className="text-sm text-gray-600">/jour</span>
                  </div>
                  <Button className="bg-primary hover:bg-primary-dark transition-colors">
                    Réserver
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCars;
