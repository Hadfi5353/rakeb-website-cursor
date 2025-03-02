
import { useIsMobile } from "@/hooks/use-mobile";

interface ReservationSummaryProps {
  startDate?: Date;
  endDate?: Date;
  car: any;
  calculateTotal: () => number;
  promoApplied: boolean;
}

export const ReservationSummary = ({ 
  startDate, 
  endDate, 
  car, 
  calculateTotal, 
  promoApplied 
}: ReservationSummaryProps) => {
  const isMobile = useIsMobile();
  
  if (!startDate || !endDate) return null;
  
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className={`${isMobile ? 'p-3' : 'p-4'} border rounded-lg bg-gray-50 space-y-2`}>
      <div className="flex justify-between text-sm">
        <span>Durée de location :</span>
        <span className="font-medium">
          {days} jours
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Prix par jour :</span>
        <span className="font-medium">{car?.price} Dh</span>
      </div>
      {promoApplied && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Réduction (WELCOME) :</span>
          <span>-{Math.round(calculateTotal() * 0.1)} Dh</span>
        </div>
      )}
      <div className="flex justify-between pt-2 border-t text-primary font-bold">
        <span>Prix total estimé :</span>
        <span>{calculateTotal()} Dh</span>
      </div>
    </div>
  );
};
