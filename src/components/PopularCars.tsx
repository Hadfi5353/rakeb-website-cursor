
import { Car, MapPin, Star, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
    <section id="popular" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Véhicules populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les véhicules les plus appréciés par notre communauté
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fadeIn" style={{ animationDelay: `${index * 200}ms` }}>
              <CardHeader className="p-0">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{car.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{car.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{car.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm">{car.reviews} avis</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-gray-50">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <span className="text-2xl font-bold text-primary">{car.price} Dh</span>
                    <span className="text-gray-600 text-sm">/jour</span>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    Réserver
                  </button>
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
