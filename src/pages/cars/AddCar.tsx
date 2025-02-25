
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Car } from "lucide-react";
import { vehiclesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

import ImageUpload from "./components/ImageUpload";
import VehicleBasicInfo from "./components/VehicleBasicInfo";
import VehicleDetails from "./components/VehicleDetails";
import LocationInput from "./components/LocationInput";
import VehicleSpecs from "./components/VehicleSpecs";
import VehicleDescription from "./components/VehicleDescription";

const AddCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    location: "",
    description: "",
    transmission: "",
    fuel: "",
    longitude: 0,
    latitude: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un véhicule",
      });
      navigate("/auth/login");
      return;
    }

    try {
      const vehicleData = {
        name: `${formData.brand} ${formData.model} ${formData.year}`,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        location: formData.location,
        description: formData.description,
        transmission: formData.transmission as "manual" | "automatic",
        fuel: formData.fuel as "diesel" | "essence" | "hybrid" | "electric",
        longitude: formData.longitude,
        latitude: formData.latitude,
        category: "Berline" as const,
        rating: 0,
        reviews_count: 0,
        isPremium: false,
        available_units: 1,
        views_count: 0,
        features: [],
      };

      await vehiclesApi.createVehicle(vehicleData);
      toast({
        title: "Succès",
        description: "Votre véhicule a été ajouté avec succès",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du véhicule",
      });
      console.error("Error creating vehicle:", error);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b bg-white">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>
        <div className="flex items-center gap-2 text-primary">
          <Car className="w-5 h-5" />
          <span className="font-medium">Rakeb</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-4">
          <Card className="h-full bg-white shadow-sm border-0 flex flex-col">
            <CardHeader className="py-3 border-b bg-gray-50/50">
              <CardTitle className="text-xl font-semibold">
                Mettre un véhicule en location
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4">
              <form onSubmit={handleSubmit} className="h-full grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <VehicleBasicInfo
                    brand={formData.brand}
                    model={formData.model}
                    onBrandChange={(value) => setFormData({ ...formData, brand: value })}
                    onModelChange={(value) => setFormData({ ...formData, model: value })}
                  />
                  <VehicleDetails
                    year={formData.year}
                    price={formData.price}
                    onYearChange={(value) => setFormData({ ...formData, year: value })}
                    onPriceChange={(value) => setFormData({ ...formData, price: value })}
                  />
                  <LocationInput
                    location={formData.location}
                    onLocationChange={(value) => setFormData({ ...formData, location: value })}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <VehicleSpecs
                    transmission={formData.transmission}
                    fuel={formData.fuel}
                    onTransmissionChange={(value) => setFormData({ ...formData, transmission: value })}
                    onFuelChange={(value) => setFormData({ ...formData, fuel: value })}
                  />
                  <VehicleDescription
                    description={formData.description}
                    onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
                  />
                  <div className="bg-gray-50/50 rounded-lg p-3">
                    <ImageUpload />
                  </div>
                </div>
              </form>
            </CardContent>

            {/* Footer */}
            <div className="p-4 border-t mt-auto bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  En continuant, vous acceptez nos{" "}
                  <Link to="/legal" className="text-primary hover:text-primary-dark">
                    conditions d'utilisation
                  </Link>
                </span>
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    size="sm"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit"
                    size="sm"
                  >
                    Publier
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
