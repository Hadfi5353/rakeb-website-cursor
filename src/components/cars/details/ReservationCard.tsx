
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Vehicle } from "@/lib/types";

interface ReservationCardProps {
  vehicle: Vehicle;
  onReserve: () => void;
}

const ReservationCard = ({ vehicle, onReserve }: ReservationCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-2xl font-bold text-gray-900 mb-4">
          {vehicle.price} Dh <span className="text-sm font-normal text-gray-600">/jour</span>
        </div>

        <Button 
          className="w-full mb-4"
          onClick={onReserve}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Réserver maintenant
        </Button>

        <div className="flex items-center justify-center text-sm text-gray-600">
          <Shield className="w-4 h-4 mr-2" />
          Réservation instantanée
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
