
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Info, Shield, Tag, Car, MapPin, Star, ArrowLeft, 
  Clock, Users, CalendarIcon, ChevronRight, AlertCircle, Zap } from "lucide-react";
import { toast } from "sonner";

const insuranceOptions = [
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

const additionalOptions = [
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

const paymentMethods = [
  { id: "card", name: "Carte bancaire", icon: CreditCard },
  { id: "applepay", name: "Apple Pay", icon: CreditCard },
  { id: "googlepay", name: "Google Pay", icon: CreditCard },
];

const ReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state?.car;

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

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Véhicule non trouvé</h1>
          <p className="text-gray-600 mb-6">Désolé, nous n'avons pas pu trouver le véhicule que vous souhaitez réserver.</p>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
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

  const getSelectedInsurance = () => {
    return insuranceOptions.find(ins => ins.id === selectedInsurance);
  };

  const handleSubmit = () => {
    toast.success("Réservation confirmée ! Vous allez recevoir un email de confirmation.", {
      duration: 5000,
      description: "Les détails de votre réservation ont été envoyés à votre adresse email."
    });
    navigate('/');
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "WELCOME") {
      setPromoApplied(true);
      toast.success("Code promo appliqué ! -10% sur votre réservation");
    } else {
      toast.error("Code promo invalide");
      setPromoCode("");
    }
  };

  const getProgress = () => {
    return (currentStep / 5) * 100;
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return startDate && endDate;
      case 2:
        return selectedInsurance !== "";
      case 3:
        return formData.fullName && formData.email && formData.phone;
      case 4:
        return formData.cardNumber && formData.expiry && formData.cvv;
      default:
        return true;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Détails et dates";
      case 2: return "Assurance et options";
      case 3: return "Vos informations";
      case 4: return "Paiement sécurisé";
      case 5: return "Confirmation";
      default: return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-primary/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" />
                  Détails du véhicule
                </h3>
                {car.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{car.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <Car className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{car.name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{car.location}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{car.seats || "5"} places</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Confirmation instantanée</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Dates de location
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {startDate && endDate && (
              <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Durée de location :</span>
                  <span className="font-medium">
                    {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} jours
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Prix par jour :</span>
                  <span className="font-medium">{car.price} Dh</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-primary font-bold">
                  <span>Prix total estimé :</span>
                  <span>{calculateTotal()} Dh</span>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Options d'assurance
              </h3>
              <RadioGroup
                value={selectedInsurance}
                onValueChange={setSelectedInsurance}
                className="space-y-4"
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
                        <div className="flex justify-between items-center">
                          <Label htmlFor={option.id} className="font-medium">
                            {option.name}
                          </Label>
                          <span className="text-sm font-medium text-primary">{option.price} Dh/jour</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 mb-2">
                          {option.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <AlertCircle className="w-4 h-4 mr-1 text-amber-500" />
                          <span>Caution : {option.caution > 0 ? `${option.caution} Dh` : "Aucune caution"}</span>
                        </div>
                        <ul className="space-y-1">
                          {option.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-primary" />
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

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Options supplémentaires
              </h3>
              <div className="space-y-3">
                {additionalOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedOptions.includes(option.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => toggleOption(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          selectedOptions.includes(option.id) ? 'bg-primary border-primary' : 'border-gray-300'
                        }`}>
                          {selectedOptions.includes(option.id) && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{option.name}</p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{option.price} Dh</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Sous-total :</span>
                <span>{calculateTotal() - (promoApplied ? calculateTotal() * 0.1 : 0)} Dh</span>
              </div>
              {promoApplied && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Réduction (WELCOME) :</span>
                  <span>-{Math.round(calculateTotal() * 0.1)} Dh</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-bold text-primary pt-2 border-t">
                <span>Total :</span>
                <span>{calculateTotal()} Dh</span>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Informations personnelles
              </h3>
              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Votre nom complet"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
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
                      required
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
                    required
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
                  disabled={promoApplied}
                />
                <Button 
                  variant="outline"
                  onClick={applyPromoCode}
                  className="whitespace-nowrap"
                  disabled={promoApplied || !promoCode}
                >
                  Appliquer
                </Button>
              </div>
              {promoApplied && (
                <div className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Code promo WELCOME appliqué : -10%</span>
                </div>
              )}
            </div>
            
            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <h4 className="font-medium text-gray-700">Récapitulatif</h4>
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
                <div className="flex justify-between">
                  <span>Assurance {getSelectedInsurance()?.name}</span>
                  <span className="font-medium">{getSelectedInsurance()?.price} Dh/jour</span>
                </div>
                
                {selectedOptions.length > 0 && (
                  <>
                    <div className="flex justify-between font-medium">
                      <span>Options</span>
                      <span></span>
                    </div>
                    {selectedOptions.map(optId => {
                      const opt = additionalOptions.find(o => o.id === optId);
                      return opt ? (
                        <div key={opt.id} className="flex justify-between text-xs ml-4">
                          <span>{opt.name}</span>
                          <span>{opt.price} Dh</span>
                        </div>
                      ) : null;
                    })}
                  </>
                )}
                
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
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
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Méthode de paiement
              </h3>
              <RadioGroup
                value={selectedPayment}
                onValueChange={setSelectedPayment}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`p-3 border rounded-lg transition-all ${
                      selectedPayment === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center gap-2">
                        <method.icon className="w-5 h-5 text-gray-600" />
                        <Label htmlFor={method.id} className="font-medium">
                          {method.name}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

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
                    required
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les <a href="#" className="text-primary hover:underline">conditions générales</a> et la <a href="#" className="text-primary hover:underline">politique de confidentialité</a>
                </label>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Politique d'annulation</p>
                  <p>Gratuite jusqu'à 48h avant le début de la location. Des frais peuvent s'appliquer en cas d'annulation tardive.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/5 space-y-2">
              <div className="flex items-center justify-between text-base font-bold text-primary">
                <span>Montant total à payer</span>
                <span>{calculateTotal()} Dh</span>
              </div>
              <p className="text-xs text-gray-500">
                Une caution de {getSelectedInsurance()?.caution || 0} Dh sera préautorisée sur votre carte bancaire mais non débitée.
              </p>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h3>
              <p className="text-gray-600">
                Votre réservation a été confirmée. Un email de confirmation a été envoyé à {formData.email}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                Détails de la réservation
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Numéro de réservation</span>
                  <span className="font-medium">RAK-{Math.floor(Math.random() * 1000000)}</span>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Véhicule</span>
                    <span className="font-medium">{car?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dates</span>
                    <span className="font-medium">
                      {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lieu de prise en charge</span>
                    <span className="font-medium">{car?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant payé</span>
                    <span className="font-medium text-primary">{calculateTotal()} Dh</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Ajouter au calendrier
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <MapPin className="w-4 h-4" />
                  Voir l'itinéraire
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 text-center">
              <p>Besoin d'aide ? <a href="#" className="text-primary hover:underline">Contactez-nous</a></p>
              <p className="mt-1">Ou consultez vos <a href="#" className="text-primary hover:underline">réservations</a></p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Card className="mb-6">
          <CardHeader className="p-6 pb-3">
            <div className="flex justify-between items-center w-full">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>Étape {currentStep}/5</span>
                <span className="text-gray-400 mx-2">•</span>
                <span>{getStepTitle()}</span>
              </CardTitle>
              {currentStep < 5 && (
                <Badge variant="outline" className="font-normal">
                  {Math.ceil((endDate?.getTime() || 0 - (startDate?.getTime() || 0)) / (1000 * 60 * 60 * 24) || 0)} jours
                </Badge>
              )}
            </div>
            <Progress value={getProgress()} className="h-1 mt-4" />
          </CardHeader>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {currentStep < 5 ? (
            <>
              {currentStep > 1 && (
                <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
                  Retour
                </Button>
              )}
              <div className={`${currentStep === 1 && currentStep > 1 ? '' : 'ml-auto'}`}>
                <Button 
                  onClick={currentStep === 4 ? handleSubmit : () => setCurrentStep(prev => prev + 1)}
                  disabled={!canContinue()}
                  className="bg-primary hover:bg-primary/90 gap-2"
                  size="lg"
                >
                  {currentStep === 4 ? 'Payer et confirmer' : 'Continuer'}
                  {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={() => navigate('/')} className="w-full bg-primary hover:bg-primary/90" size="lg">
              Terminer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
