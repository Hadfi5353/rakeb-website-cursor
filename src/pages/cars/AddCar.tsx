
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <Car className="w-5 h-5" />
            <span className="font-medium">Rakeb</span>
          </div>
        </div>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="text-center border-b bg-gray-50/50 rounded-t-lg">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Mettre un véhicule en location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <VehicleBasicInfo
                      brand={formData.brand}
                      model={formData.model}
                      onBrandChange={(value) => setFormData({ ...formData, brand: value })}
                      onModelChange={(value) => setFormData({ ...formData, model: value })}
                    />
                    <VehicleSpecs
                      transmission={formData.transmission}
                      fuel={formData.fuel}
                      onTransmissionChange={(value) => setFormData({ ...formData, transmission: value })}
                      onFuelChange={(value) => setFormData({ ...formData, fuel: value })}
                    />
                  </div>
                  <div className="space-y-6">
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
                </div>

                <VehicleDescription
                  description={formData.description}
                  onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
                />

                <div className="border rounded-lg p-6 bg-gray-50/50">
                  <h3 className="text-lg font-medium mb-4">Photos du véhicule</h3>
                  <ImageUpload />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="w-32"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="w-32"
                >
                  Publier
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          En publiant votre annonce, vous acceptez nos{" "}
          <Link to="/legal" className="text-primary hover:text-primary-dark">
            conditions d'utilisation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
