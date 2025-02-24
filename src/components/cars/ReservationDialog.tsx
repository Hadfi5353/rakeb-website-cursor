
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
import { CheckCircle, CreditCard, Info, Shield, Tag, Car, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
}

const insuranceOptions = [
  {
    id: "basic",
    name: "Basique",
    description: "Couverture des dommages matériels de base",
    price: 50,
    features: ["Dommages matériels", "Assistance routière", "Responsabilité civile"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Couverture complète avec assistance 24/7",
    price: 100,
    features: ["Tout inclus en Basique", "Vol et incendie", "Assistance 24/7", "Conducteur supplémentaire inclus"],
  },
];

const ReservationDialog = ({ isOpen, onClose, car }: ReservationDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    let total = days * parseInt(car.price);
    
    if (selectedInsurance) {
      const insurance = insuranceOptions.find(opt => opt.id === selectedInsurance);
      if (insurance) {
        total += insurance.price * days;
      }
    }
    
    if (promoCode === "WELCOME") {
      total = total * 0.9;
    }
    
    return Math.round(total);
  };

  const handleSubmit = () => {
    toast.success("Réservation confirmée ! Vous allez recevoir un email de confirmation.", {
      duration: 5000,
    });
    onClose();
  };

  const applyPromoCode = () => {
    if (promoCode === "WELCOME") {
      toast.success("Code promo appliqué ! -10% sur votre réservation");
    } else {
      toast.error("Code promo invalide");
      setPromoCode("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            {car?.name}
            <div className="flex items-center text-sm font-normal text-gray-600 ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              {car?.rating}
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {car?.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-primary/5">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Dates de location
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Début</Label>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      className="rounded-md border"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Fin</Label>
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

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Options d'assurance
                </h3>
                <RadioGroup
                  value={selectedInsurance}
                  onValueChange={setSelectedInsurance}
                  className="gap-4"
                >
                  {insuranceOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedInsurance === option.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="font-medium">
                            {option.name} - {option.price} Dh/jour
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            {option.description}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {option.features.map((feature, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {startDate && endDate && (
                <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Durée de location :</span>
                    <span className="font-medium">
                      {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} jours
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-primary border-t pt-2">
                    <span>Prix total :</span>
                    <span>{calculateTotal()} Dh</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Informations personnelles
                </h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Votre nom complet"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Votre numéro"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  <Label>Code promo</Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: WELCOME"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button 
                    variant="outline"
                    onClick={applyPromoCode}
                    className="whitespace-nowrap"
                  >
                    Appliquer
                  </Button>
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Paiement sécurisé
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                      />
                      <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Date d'expiration</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/AA"
                        value={formData.expiry}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="password"
                        maxLength={3}
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Récapitulatif</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Véhicule</span>
                    <span className="font-medium">{car?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée</span>
                    <span className="font-medium">
                      {Math.ceil((endDate?.getTime() || 0 - (startDate?.getTime() || 0)) / (1000 * 60 * 60 * 24))} jours
                    </span>
                  </div>
                  {selectedInsurance && (
                    <div className="flex justify-between">
                      <span>Assurance {insuranceOptions.find(opt => opt.id === selectedInsurance)?.name}</span>
                      <span className="font-medium">Incluse</span>
                    </div>
                  )}
                  {promoCode === "WELCOME" && (
                    <div className="flex justify-between text-primary">
                      <span>Réduction (WELCOME)</span>
                      <span>-10%</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t font-bold text-primary">
                    <span>Total</span>
                    <span>{calculateTotal()} Dh</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {currentStep === 2 && (
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Retour
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button 
            onClick={currentStep === 1 ? () => setCurrentStep(2) : handleSubmit}
            disabled={currentStep === 1 ? (!startDate || !endDate) : false}
            className="bg-primary hover:bg-primary/90"
          >
            {currentStep === 1 ? "Continuer" : "Confirmer la réservation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
