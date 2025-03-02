
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// New component imports
import QuickStats from "@/components/cars/details/QuickStats";
import VehicleDescription from "@/components/cars/details/VehicleDescription";
import MobileOwnerCard from "@/components/cars/details/MobileOwnerCard";
import MobileReviews from "@/components/cars/details/MobileReviews";
import MobileBottomBar from "@/components/cars/details/MobileBottomBar";
import OwnerInfo from "@/components/cars/details/OwnerInfo";
import RentalConditions from "@/components/cars/details/RentalConditions";
import RentalPolicy from "@/components/cars/details/RentalPolicy";

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
        
        <div className="px-4 py-6 pb-24">
          <VehicleHeader 
            vehicle={vehicle}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          
          <div className="space-y-6 mt-6">
            {/* Quick stats */}
            <QuickStats vehicle={vehicle} />
            
            {/* Description */}
            <VehicleDescription vehicle={vehicle} />
            
            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <VehicleFeatures />
              </CardContent>
            </Card>
            
            {/* Owner */}
            <MobileOwnerCard />
            
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
            <MobileReviews />
          </div>
        </div>
        
        {/* Fixed bottom reservation bar */}
        <MobileBottomBar 
          vehicle={vehicle} 
          onReserve={() => setIsReservationOpen(true)} 
        />
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

            <OwnerInfo />
            <RentalConditions />
            <VehicleMap vehicle={vehicle} />
            <RentalPolicy />
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
