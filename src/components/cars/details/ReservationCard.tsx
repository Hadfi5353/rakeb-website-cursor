
import { CalendarIcon, Clock, Shield, Star, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ReservationCardProps {
  vehicle: Vehicle;
  onReserve: () => void;
}

const ReservationCard = ({ vehicle, onReserve }: ReservationCardProps) => {
  return (
    <Card className="border-2 hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {vehicle.price} Dh <span className="text-sm font-normal text-gray-600">/jour</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>{vehicle.rating || "4.8"}</span>
              <span className="mx-1">•</span>
              <span>{vehicle.trips || "24"} voyages</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary">
            Disponible
          </Badge>
        </div>

        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span>{vehicle.location || "Casablanca, Maroc"}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            <span>{vehicle.seats || "5"} places</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>Confirmation instantanée</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
            onClick={onReserve}
            size="lg"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Réserver maintenant
          </Button>
          
          <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
            <Shield className="w-4 h-4 mr-2 text-primary" />
            Paiement sécurisé et flexible
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
