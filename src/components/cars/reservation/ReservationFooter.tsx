
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  if (currentStep === 5) {
    return (
      <Button className="w-full" onClick={onClose}>
        Terminer
      </Button>
    );
  }

  return (
    <div className={`flex ${isMobile ? 'flex-col w-full gap-2' : 'w-full justify-between'}`}>
      {currentStep > 1 && (
        <Button 
          variant="outline" 
          onClick={handleBack}
          className={isMobile ? "w-full" : ""}
        >
          Retour
        </Button>
      )}
      <div className={`${isMobile ? 'w-full' : currentStep === 1 ? 'w-full' : ''}`}>
        <Button
          onClick={currentStep === 4 ? handleSubmit : handleNext}
          disabled={!canContinue}
          className={`${isMobile ? 'w-full' : currentStep === 1 ? 'w-full' : ''}`}
        >
          {currentStep === 4 ? "Confirmer la réservation" : "Continuer"}
        </Button>
      </div>
    </div>
  );
};
