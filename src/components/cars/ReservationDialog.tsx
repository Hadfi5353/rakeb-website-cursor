
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

import { StepHeader } from "./reservation/StepHeader";
import { ReservationSteps } from "./reservation/ReservationSteps";
import { ReservationFooter } from "./reservation/ReservationFooter";

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
}

// Shared data for components
export const insuranceOptions = [
  {
    id: "basic",
    name: "Basique",
    description: "Couverture des dommages matériels de base",
    price: 50,
    caution: 5000,
    features: ["Dommages matériels", "Assistance routière", "Responsabilité civile"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Couverture complète avec assistance 24/7",
    price: 100,
    caution: 1000,
    features: ["Tout inclus en Basique", "Vol et incendie", "Assistance 24/7", "Conducteur supplémentaire inclus"],
  },
  {
    id: "zero",
    name: "Zéro Souci",
    description: "Zéro franchise, zéro stress",
    price: 150,
    caution: 0,
    features: ["Tout inclus en Premium", "Aucune caution", "Livraison incluse", "Plein d'essence offert"],
  },
];

export const additionalOptions = [
  {
    id: "gps",
    name: "GPS Premium",
    price: 20,
    description: "Navigation professionnelle avec mise à jour en temps réel"
  },
  {
    id: "childSeat",
    name: "Siège enfant",
    price: 15,
    description: "Siège homologué adapté pour enfants de 9 à 36kg"
  },
  {
    id: "delivery",
    name: "Livraison à domicile",
    price: 50,
    description: "Livraison et récupération du véhicule à l'adresse de votre choix"
  }
];

export const paymentMethods = [
  { id: "card", name: "Carte bancaire", icon: CreditCard },
  { id: "applepay", name: "Apple Pay", icon: CreditCard },
  { id: "googlepay", name: "Google Pay", icon: CreditCard },
];

const ReservationDialog = ({ isOpen, onClose, car }: ReservationDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedInsurance, setSelectedInsurance] = useState("basic");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const isMobile = useIsMobile();

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedInsurance("basic");
        setSelectedOptions([]);
        setSelectedPayment("card");
        setPromoCode("");
        setPromoApplied(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          cardNumber: "",
          expiry: "",
          cvv: "",
        });
      }, 300);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Base price
    let total = days * parseInt(car.price);
    
    // Insurance cost
    if (selectedInsurance) {
      const insurance = insuranceOptions.find(opt => opt.id === selectedInsurance);
      if (insurance) {
        total += insurance.price * days;
      }
    }
    
    // Additional options
    selectedOptions.forEach(optionId => {
      const option = additionalOptions.find(opt => opt.id === optionId);
      if (option) {
        total += option.price;
      }
    });
    
    // Apply promo code
    if (promoApplied) {
      total = total * 0.9; // 10% discount
    }
    
    return Math.round(total);
  };

  const handleSubmit = () => {
    toast.success("Réservation confirmée ! Vous allez recevoir un email de confirmation.", {
      duration: 5000,
      description: "Les détails de votre réservation ont été envoyés à votre adresse email."
    });
    setCurrentStep(5);
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return Boolean(startDate) && Boolean(endDate);
      case 2:
        return selectedInsurance !== "";
      case 3:
        return Boolean(formData.fullName) && Boolean(formData.email) && Boolean(formData.phone);
      case 4:
        return Boolean(formData.cardNumber) && Boolean(formData.expiry) && Boolean(formData.cvv);
      default:
        return true;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`p-0 ${isMobile ? 'max-w-[95vw] h-[85vh]' : 'sm:max-w-[700px]'}`}>
        <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b">
          <StepHeader 
            currentStep={currentStep} 
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className={`px-4 py-3 ${isMobile ? 'overflow-y-auto h-[calc(100%-170px)]' : 'max-h-[70vh] overflow-y-auto px-6 py-4'}`}>
          <ReservationSteps 
            currentStep={currentStep}
            car={car}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            selectedInsurance={selectedInsurance}
            setSelectedInsurance={setSelectedInsurance}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            formData={formData}
            handleInputChange={handleInputChange}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            promoApplied={promoApplied}
            setPromoApplied={setPromoApplied}
            calculateTotal={calculateTotal}
            handleSubmit={handleSubmit}
          />
        </div>

        <DialogFooter className={`${isMobile ? 'p-4 pt-2' : 'p-6 pt-2'} border-t flex-row justify-between sticky bottom-0 bg-white`}>
          <ReservationFooter 
            currentStep={currentStep}
            canContinue={canContinue()}
            handleBack={() => setCurrentStep(prev => prev - 1)}
            handleNext={() => setCurrentStep(prev => prev + 1)}
            handleSubmit={handleSubmit}
            onClose={onClose}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
