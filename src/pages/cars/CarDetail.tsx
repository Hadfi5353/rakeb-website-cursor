
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "@/lib/api";
import { toast } from "sonner";
import VehicleGallery from "@/components/cars/VehicleGallery";
import ReservationDialog from "@/components/cars/ReservationDialog";
import VehicleHeader from "@/components/cars/details/VehicleHeader";
import VehicleSpecs from "@/components/cars/details/VehicleSpecs";
import VehicleFeatures from "@/components/cars/details/VehicleFeatures";
import VehicleMap from "@/components/cars/details/VehicleMap";
import ReservationCard from "@/components/cars/details/ReservationCard";
import CustomerReviews from "@/components/cars/details/CustomerReviews";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Info, Key, Shield, Star, Check, Calendar, Fuel, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const CarDetail = () => {
  const { id } = useParams();
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehiclesApi.getVehicle(id || ''),
  });

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-[40vh] md:h-[60vh] bg-gray-200 rounded-lg mb-8" />
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

  // Mobile layout shows the reservation card at the bottom
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <VehicleGallery images={demoImages} />
        
        <div className="px-4 py-6">
          <VehicleHeader 
            vehicle={vehicle}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          
          <div className="space-y-6 mt-6">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-primary/5">
                <CardContent className="p-3 flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="font-medium text-sm">{vehicle.transmission}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardContent className="p-3 flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Carburant</p>
                    <p className="font-medium text-sm">{vehicle.fuel}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardContent className="p-3 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Année</p>
                    <p className="font-medium text-sm">{vehicle.year}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardContent className="p-3 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Places</p>
                    <p className="font-medium text-sm">{vehicle.seats || 5}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Description */}
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-600 text-sm">{vehicle.description}</p>
              </CardContent>
            </Card>
            
            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <VehicleFeatures />
              </CardContent>
            </Card>
            
            {/* Owner */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div>
                    <h3 className="font-semibold">Mohammed A.</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      4.9 · Membre depuis 2023
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter le propriétaire
                </Button>
              </CardContent>
            </Card>
            
            {/* Map */}
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Localisation</h2>
                <div className="h-[200px]">
                  <VehicleMap vehicle={vehicle} />
                </div>
              </CardContent>
            </Card>
            
            {/* Reviews */}
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Avis des locataires</h2>
                <div className="space-y-4">
                  {[1, 2].map((review) => (
                    <div key={review} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm">John Doe</h3>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="ml-1 text-xs">5.0</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs">
                            Excellent véhicule, très propre et bien entretenu.
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Il y a 2 semaines
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Fixed bottom reservation bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-10 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-xl font-bold">{vehicle.price} Dh</span>
              <span className="text-sm text-gray-500">/jour</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm ml-1">4.9 (24 avis)</span>
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={() => setIsReservationOpen(true)}
          >
            Réserver maintenant
          </Button>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VehicleHeader 
          vehicle={vehicle}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        <div className="mb-8">
          <VehicleGallery images={demoImages} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <VehicleSpecs vehicle={vehicle} />

                <div className="prose prose-sm max-w-none mb-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>

                <VehicleFeatures />
              </div>
            </div>

            <CustomerReviews />
          </div>

          <div className="space-y-6">
            <ReservationCard 
              vehicle={vehicle}
              onReserve={() => setIsReservationOpen(true)}
            />

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

            <VehicleMap vehicle={vehicle} />

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Politique d'annulation</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800">Annulation flexible</h3>
                      <p className="text-sm text-green-700">
                        Annulation gratuite jusqu'à 24h avant le début de la location.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Conditions de remboursement :</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                        <span>Annulation plus de 24h avant : remboursement à 100%</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                        <span>Annulation entre 12h et 24h avant : remboursement à 50%</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                        <span>Annulation moins de 12h avant : aucun remboursement</span>
                      </li>
                    </ul>
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
