import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  MapPin,
  User,
  Star,
  Shield,
  Info,
  Calendar as CalendarIcon,
  MessageCircle,
  Check,
  Coffee,
  Key,
  Fuel,
  Settings,
  Users,
  Gauge,
} from "lucide-react";
import { vehiclesApi } from "@/lib/api";
import { Vehicle } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import VehicleGallery from "@/components/cars/VehicleGallery";
import ReservationDialog from "@/components/cars/ReservationDialog";

const CarDetail = () => {
  const { id } = useParams();
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const navigate = useNavigate();

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehiclesApi.getVehicle(id || ''),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-[60vh] bg-gray-200 rounded-lg mb-8" />
            <div className="h-8 bg-gray-200 w-1/3 rounded mb-4" />
            <div className="h-4 bg-gray-200 w-1/4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Véhicule non trouvé
          </h1>
          <p className="text-gray-600 mb-4">
            Désolé, nous n'avons pas pu trouver le véhicule que vous recherchez.
          </p>
          <Button onClick={() => navigate(-1)}>
            Retourner à la recherche
          </Button>
        </div>
      </div>
    );
  }

  const demoImages = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
          >
            ← Retour aux résultats
          </Link>
        </div>

        <div className="mb-8">
          <VehicleGallery images={demoImages} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {vehicle.brand} {vehicle.model} {vehicle.year}
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{vehicle.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-primary/5 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="ml-1 font-medium text-primary">4.8</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium">{vehicle.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                      <Fuel className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Carburant</p>
                      <p className="font-medium">{vehicle.fuel}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Places</p>
                      <p className="font-medium">5</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kilométrage</p>
                      <p className="font-medium">Illimité</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none mb-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Équipements</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["GPS", "Bluetooth", "Climatisation", "USB", "ABS", "Airbags"].map((feature) => (
                      <div key={feature} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Avis des locataires</h2>
              <div className="space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">John Doe</h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm">5.0</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Excellent véhicule, très propre et bien entretenu. La location s'est très bien passée.
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          Il y a 2 semaines
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {vehicle.price} Dh <span className="text-sm font-normal text-gray-600">/jour</span>
                </div>

                <Button 
                  className="w-full mb-4"
                  onClick={() => setIsReservationOpen(true)}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Réserver maintenant
                </Button>

                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2" />
                  Réservation instantanée
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200" />
                  <div>
                    <h3 className="font-semibold">Mohammed A.</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      4.9 · Membre depuis 2023
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter le propriétaire
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Conditions de location</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                    <p>Âge minimum : 21 ans</p>
                  </div>
                  <div className="flex items-start">
                    <Key className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                    <p>2 ans de permis minimum</p>
                  </div>
                  <div className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                    <p>Caution : 5000 Dh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ReservationDialog
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        car={vehicle}
      />
    </div>
  );
};

export default CarDetail;
