
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ReservationFooterProps {
  currentStep: number;
  canContinue: boolean;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  onClose: () => void;
}

export const ReservationFooter = ({
  currentStep,
  canContinue,
  handleBack,
  handleNext,
  handleSubmit,
  onClose
}: ReservationFooterProps) => {
  return (
    <div className="p-6 pt-2 border-t flex-row justify-between">
      {currentStep < 5 ? (
        <>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Retour
            </Button>
          )}
          <div className={`${currentStep === 1 ? 'w-full' : ''}`}>
            <Button 
              onClick={currentStep === 4 ? handleSubmit : handleNext}
              disabled={!canContinue}
              className="bg-primary hover:bg-primary/90 gap-2"
              size="lg"
            >
              {currentStep === 4 ? 'Payer et confirmer' : 'Continuer'}
              {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90" size="lg">
          Terminer
        </Button>
      )}
    </div>
  );
};
