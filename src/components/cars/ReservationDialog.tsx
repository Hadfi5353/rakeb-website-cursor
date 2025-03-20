import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format, addDays, differenceInDays, isBefore, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Vehicle } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import StripePaymentForm from "@/components/payment/StripePaymentForm";

interface ReservationDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BookedPeriod {
  start: Date;
  end: Date;
}

const ReservationDialog = ({ vehicle, open, onOpenChange }: ReservationDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { supabase } = useSupabase();
  
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: tomorrow,
    to: nextWeek
  });
  const [pickupLocation, setPickupLocation] = useState(vehicle.location || "");
  const [returnLocation, setReturnLocation] = useState(vehicle.location || "");
  const [message, setMessage] = useState("");
  const [bookedPeriods, setBookedPeriods] = useState<BookedPeriod[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculer le prix total
  const durationDays = dateRange?.from && dateRange?.to ? 
    differenceInDays(dateRange.to, dateRange.from) || 1 : 1;
  const dailyRate = vehicle.price_per_day || vehicle.price || 0;
  const basePrice = dailyRate * durationDays;
  const serviceFee = Math.round(basePrice * 0.10); // 10% de frais de service
  const totalPrice = basePrice + serviceFee;

  // Charger les périodes déjà réservées
  useEffect(() => {
    const loadBookedPeriods = async () => {
      if (!vehicle?.id) return;

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('vehicle_id', vehicle.id)
        .in('status', ['pending', 'confirmed', 'in_progress']);

      if (error) {
        console.error("Erreur lors du chargement des réservations:", error);
        return;
      }

      const periods = bookings?.map(booking => ({
        start: new Date(booking.start_date),
        end: new Date(booking.end_date)
      })) || [];

      setBookedPeriods(periods);
    };

    loadBookedPeriods();
  }, [vehicle?.id, supabase]);

  // Fonction pour vérifier si une date est déjà réservée
  const isDateBooked = (date: Date) => {
    return bookedPeriods.some(period => 
      isWithinInterval(date, { 
        start: new Date(period.start.setHours(0, 0, 0, 0)), 
        end: new Date(period.end.setHours(23, 59, 59, 999))
      })
    );
  };

  // Fonction pour vérifier si une plage de dates est disponible
  const isRangeAvailable = (start: Date, end: Date) => {
    // Vérifier chaque jour de la plage
    let current = new Date(start);
    while (current <= end) {
      if (isDateBooked(current)) {
        return false;
      }
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  // Fonction pour obtenir les classes CSS pour une date donnée
  const getDateClassName = (date: Date) => {
    if (isDateBooked(date)) {
      return "line-through text-gray-400 bg-gray-100";
    }
    return "";
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Dates manquantes",
        description: "Veuillez sélectionner vos dates de location",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer une réservation",
        variant: "destructive",
      });
      onOpenChange(false);
      navigate("/auth/login");
      return;
    }
    
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Dates manquantes",
        description: "Veuillez sélectionner vos dates de location",
        variant: "destructive",
      });
      return;
    }
    
    if (!pickupLocation) {
      toast({
        title: "Lieu de prise en charge manquant",
        description: "Veuillez indiquer le lieu de prise en charge",
        variant: "destructive",
      });
      return;
    }
    
    if (!returnLocation) {
      toast({
        title: "Lieu de retour manquant",
        description: "Veuillez indiquer le lieu de retour",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler une réservation réussie
      setTimeout(() => {
        toast({
          title: "Réservation confirmée",
          description: "Votre demande de réservation a été envoyée au propriétaire",
        });
        onOpenChange(false);
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    return days * vehicle.price_per_day;
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setIsSubmitting(true);
      
      if (!dateRange?.from || !dateRange?.to || !user) {
        throw new Error("Données de réservation invalides");
      }

      // Vérifier d'abord la disponibilité
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('vehicle_id', vehicle.id)
        .in('status', ['pending', 'confirmed', 'in_progress'])
        .overlaps('start_date', 'end_date', dateRange.from.toISOString(), dateRange.to.toISOString());

      if (checkError) throw checkError;
      
      if (existingBookings && existingBookings.length > 0) {
        throw new Error("Ce véhicule n'est plus disponible pour les dates sélectionnées");
      }

      const { error } = await supabase.from("bookings").insert({
        vehicle_id: vehicle.id,
        user_id: user.id,
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString(),
        pickup_location: pickupLocation,
        return_location: returnLocation,
        message,
        total_price: calculateTotalPrice(),
        payment_intent_id: paymentIntentId,
        payment_status: 'preauthorized',
        status: "pending"
      });

      if (error) {
        if (error.code === 'P0001') {
          throw new Error("Ce véhicule n'est plus disponible pour les dates sélectionnées");
        }
        throw error;
      }

      toast({
        title: "Réservation en attente",
        description: "Votre réservation a été enregistrée et est en attente de confirmation par le propriétaire"
      });

      onOpenChange(false);
      navigate("/dashboard/bookings");
    } catch (error: any) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la réservation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Erreur de paiement",
      description: error,
      variant: "destructive"
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-2">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (!range) {
                    setDateRange(range);
                    return;
                  }
                  
                  // Si seulement la date de début est sélectionnée
                  if (range.from && !range.to) {
                    setDateRange(range);
                    return;
                  }

                  // Vérifier la disponibilité de la plage complète
                  if (range.from && range.to) {
                    if (!isRangeAvailable(range.from, range.to)) {
                      toast({
                        title: "Dates indisponibles",
                        description: "Cette période contient des dates déjà réservées. Veuillez choisir une autre période.",
                        variant: "destructive"
                      });
                      return;
                    }
                    setDateRange(range);
                  }
                }}
                disabled={[
                  { before: new Date() },
                  ...(bookedPeriods.flatMap(period => {
                    const days = [];
                    let current = new Date(period.start);
                    while (current <= period.end) {
                      days.push({ date: new Date(current), disabled: true });
                      current.setDate(current.getDate() + 1);
                    }
                    return days;
                  }))
                ]}
                modifiers={{
                  booked: (date) => isDateBooked(date),
                  available: (date) => !isDateBooked(date) && date >= new Date()
                }}
                modifiersStyles={{
                  booked: {
                    textDecoration: "line-through",
                    backgroundColor: "rgb(243 244 246)",
                    color: "rgb(156 163 175)",
                    cursor: "not-allowed"
                  },
                  available: {
                    fontWeight: "normal"
                  }
                }}
                numberOfMonths={isMobile ? 1 : 2}
                locale={fr}
                className="rounded-md"
                classNames={{
                  day_disabled: "opacity-50 cursor-not-allowed line-through bg-gray-100",
                  day_today: "bg-primary/10 text-primary font-bold",
                  day_selected: "!bg-primary text-primary-foreground hover:!bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_range_middle: "!bg-primary/20 text-primary",
                  day_hidden: "invisible",
                  day: "hover:bg-primary/10 rounded-md transition-colors"
                }}
              />
            </div>
            {dateRange?.from && dateRange?.to && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {format(dateRange.from, 'dd/MM/yyyy')} - {format(dateRange.to, 'dd/MM/yyyy')}
                </span>
                <span className="ml-auto">{durationDays} jours</span>
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupLocation" className="text-base">Lieu de prise en charge</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="pickupLocation"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Adresse de prise en charge"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="returnLocation" className="text-base">Lieu de retour</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="returnLocation"
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    placeholder="Adresse de retour"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base">Message au propriétaire (optionnel)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Informations supplémentaires pour le propriétaire"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-base">Résumé de la réservation</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span>
                    Du {format(dateRange?.from || tomorrow, 'dd/MM/yyyy')} au {format(dateRange?.to || nextWeek, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{pickupLocation}</span>
                </div>
              </div>
              
              <div className="pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{dailyRate} MAD x {durationDays} jours</span>
                  <span>{basePrice} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frais de service</span>
                  <span>{serviceFee} MAD</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>{totalPrice} MAD</span>
                </div>
              </div>
            </div>
            <StripePaymentForm
              amount={calculateTotalPrice()}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[500px] ${isMobile ? 'p-0' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-3 border-b' : ''} flex items-center gap-4`}>
          {currentStep > 1 && isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1">
            <h2 className="font-semibold">
              {currentStep === 1 ? "Sélectionner les dates" :
               currentStep === 2 ? "Détails de la location" :
               "Confirmer la réservation"}
            </h2>
            <p className="text-sm text-gray-500">
              {vehicle.name || `${vehicle.make} ${vehicle.model}`}
            </p>
          </div>
        </div>

        {isMobile && (
          <div className="px-4 py-2">
            <Progress value={(currentStep / 3) * 100} className="h-1" />
          </div>
        )}
        
        <div className={`${isMobile ? 'p-4' : ''} space-y-4`}>
          {renderStep()}
        </div>
        
        <div className={`${isMobile ? 'p-4 border-t bg-background' : 'flex justify-end gap-2'} mt-6`}>
          {!isMobile && currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Retour
            </Button>
          )}
          
          <Button
            type="button"
            className={isMobile ? 'w-full' : ''}
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Réservation en cours..." :
             currentStep === 3 ? "Confirmer la réservation" :
             "Continuer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
