
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, User, Calendar, Shield } from "lucide-react";

interface CarCardProps {
  car: {
    id: number;
    name: string;
    image: string;
    price: string;
    location: string;
    rating: number;
    reviews: number;
    insurance?: string;
  };
  onReserve: (car: any) => void;
}

const CarCard = ({ car, onReserve }: CarCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-medium transition-all duration-300">
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
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-primary/70" />
            <span className="text-sm">{car.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2 text-primary/70" />
            <span className="text-sm">{car.reviews} avis</span>
          </div>
          {car.insurance && (
            <div className="flex items-center text-gray-600">
              <Shield className="w-4 h-4 mr-2 text-primary/70" />
              <span className="text-sm">{car.insurance}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">{car.price} Dh</span>
            <span className="text-sm text-gray-600">/jour</span>
          </div>
          <Button 
            className="bg-primary hover:bg-primary-dark transition-colors"
            onClick={() => onReserve(car)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Réserver
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
