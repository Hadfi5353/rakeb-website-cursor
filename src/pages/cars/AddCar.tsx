
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex flex-col py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Mettre un véhicule en location</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
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
              </div>

              <LocationInput
                location={formData.location}
                onLocationChange={(value) => setFormData({ ...formData, location: value })}
              />

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

              <ImageUpload />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Publier l'annonce
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCar;
