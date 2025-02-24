
import { Car, MapPin, Star, User, Calendar, Shield, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const cars = [
  {
    id: 1,
    name: "Dacia Duster",
    image: "/placeholder.svg",
    price: "250",
    location: "Casablanca",
    rating: 4.8,
    reviews: 24,
    features: ["Climatisation", "5 places", "Bluetooth", "GPS"],
    insurance: "Tous risques incluse",
    minDuration: "3 jours",
  },
  {
    id: 2,
    name: "Renault Clio",
    image: "/placeholder.svg",
    price: "200",
    location: "Rabat",
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 3,
    name: "Volkswagen Golf",
    image: "/placeholder.svg",
    price: "300",
    location: "Marrakech",
    rating: 4.7,
    reviews: 32,
  },
];

const PopularCars = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [currentStep, setCurrentStep] = useState(1);

  const handleReservation = (car) => {
    setSelectedCar(car);
    setIsDialogOpen(true);
    setCurrentStep(1);
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !selectedCar) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * parseInt(selectedCar.price);
  };

  return (
    <section id="popular" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Véhicules populaires
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les véhicules les plus appréciés par notre communauté
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <Card 
              key={car.id} 
              className="overflow-hidden hover:shadow-medium transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader className="p-0">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
                  <div className="flex items-center bg-primary/5 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="ml-1 text-sm font-medium text-primary">{car.rating}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                    <span className="text-sm">{car.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2 text-primary/70" />
                    <span className="text-sm">{car.reviews} avis</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="w-4 h-4 mr-2 text-primary/70" />
                    <span className="text-sm">{car.insurance}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary">{car.price} Dh</span>
                    <span className="text-sm text-gray-600">/jour</span>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary-dark transition-colors"
                    onClick={() => handleReservation(car)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Réserver
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Réservation - {selectedCar?.name}</DialogTitle>
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
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      className="rounded-md border"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de fin</Label>
                    <CalendarComponent
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
    </section>
  );
};

export default PopularCars;
