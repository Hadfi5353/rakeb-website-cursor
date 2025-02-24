
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
}

const ReservationDialog = ({ isOpen, onClose, car }: ReservationDialogProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [currentStep, setCurrentStep] = useState(1);

  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * parseInt(car.price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Réservation - {car?.name}</DialogTitle>
          <DialogDescription>
            Complétez les informations pour réserver votre véhicule
          </DialogDescription>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Dates de location</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="rounded-md border"
                    disabled={(date) => !startDate || date < startDate}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lieu de prise en charge</Label>
              <Input placeholder="Adresse complète" />
            </div>

            {startDate && endDate && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Durée de location :</span>
                  <span className="font-medium">
                    {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} jours
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Prix total :</span>
                  <span className="font-bold text-primary">{calculateTotal()} Dh</span>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={() => setCurrentStep(2)}
            disabled={!startDate || !endDate}
            className="bg-primary hover:bg-primary-dark"
          >
            Continuer la réservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
