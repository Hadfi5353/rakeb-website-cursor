
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Vehicle } from "@/lib/types";

interface MobileBottomBarProps {
  vehicle: Vehicle;
  onReserve: () => void;
}

const MobileBottomBar = ({ vehicle, onReserve }: MobileBottomBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-10 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-xl font-bold">{vehicle.price} Dh</span>
          <span className="text-sm text-gray-500">/jour</span>
        </div>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm ml-1">4.9 (24 avis)</span>
        </div>
      </div>
      <Button 
        className="w-full" 
        onClick={onReserve}
      >
        Réserver maintenant
      </Button>
    </div>
  );
};

export default MobileBottomBar;
