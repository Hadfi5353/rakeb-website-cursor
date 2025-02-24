
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
import { MessageCircle, Info, Key, Shield, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const CarDetail = () => {
  const { id } = useParams();
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

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
                <div className="space-y-3 text

sm">
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
