import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Car, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useVehicle } from "@/hooks/use-vehicle";
import { VehicleFormData } from "@/types/vehicle";

import ImageUpload from "./components/ImageUpload";
import VehicleBasicInfo from "./components/VehicleBasicInfo";
import VehicleDetails from "./components/VehicleDetails";
import LocationInput from "./components/LocationInput";
import VehicleSpecs from "./components/VehicleSpecs";
import VehicleDescription from "./components/VehicleDescription";

const AddCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, getUserRole } = useAuth();
  
  const { createVehicle, loading: submitting } = useVehicle({
    onSuccess: (vehicle) => {
      toast({
        title: "Succès",
        description: "Votre véhicule a été ajouté avec succès",
      });
      
      // Redirection vers la page des véhicules du propriétaire
      navigate('/dashboard/owner/vehicles');
    },
    onError: (err) => {
      console.error("Error creating vehicle:", err);
      setError("Une erreur est survenue lors de l'ajout du véhicule. Veuillez réessayer.");
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price_per_day: "", // Renommé pour correspondre au schéma de la base de données
    location: "",
    description: "",
    transmission: "",
    fuel_type: "", // Renommé pour correspondre au schéma de la base de données
    seats: "",
    color: "",
    mileage: "",
    luggage: "",
    features: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérification de l'utilisateur et du rôle
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un véhicule",
      });
      navigate("/login");
      return;
    }

    // Vérification du rôle utilisateur
    try {
      const userRole = await getUserRole();
      if (userRole !== 'owner' && userRole !== 'admin') {
        setError("Vous devez avoir un profil propriétaire pour ajouter un véhicule. Veuillez changer votre rôle dans les paramètres de votre profil.");
        return;
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du rôle:", err);
      setError("Impossible de vérifier votre rôle. Veuillez réessayer.");
      return;
    }

    // Validation du formulaire
    if (!formData.brand || !formData.model || !formData.year || !formData.price_per_day) {
      toast({
        variant: "destructive",
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        variant: "destructive",
        title: "Images manquantes",
        description: "Veuillez ajouter au moins une image du véhicule",
      });
      return;
    }

    setLoading(true);

    try {
      // Préparation des données du véhicule pour Supabase
      const vehicleFormData: VehicleFormData = {
        make: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price_per_day: parseFloat(formData.price_per_day),
        location: formData.location,
        description: formData.description,
        transmission: formData.transmission as 'automatic' | 'manual' | 'semi-automatic',
        fuel_type: formData.fuel_type as 'diesel' | 'essence' | 'hybrid' | 'electric',
        seats: formData.seats ? parseInt(formData.seats) : undefined,
        color: formData.color,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        luggage: formData.luggage ? parseInt(formData.luggage) : undefined,
        images: images,
        features: formData.features,
        category: 'Berline', // Catégorie par défaut qui existe dans notre type enum
      };

      console.log("Tentative de création de véhicule:", vehicleFormData);

      // Création du véhicule dans la base de données via notre hook personnalisé
      await createVehicle(vehicleFormData);
      
    } catch (error) {
      console.error("Error submitting vehicle:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du véhicule",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (urls: string[]) => {
    setImages(urls);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
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
      <div className="flex-1 overflow-y-auto p-4">
        <Card className="max-w-5xl mx-auto bg-white shadow-sm border-0">
          <CardHeader className="py-4 border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold">
              Mettre un véhicule en location
            </CardTitle>
          </CardHeader>
          
          {error && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations de base */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informations de base</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <VehicleBasicInfo
                    brand={formData.brand}
                    model={formData.model}
                    onBrandChange={(value) => setFormData({ ...formData, brand: value })}
                    onModelChange={(value) => setFormData({ ...formData, model: value })}
                  />
                  <VehicleDetails
                    year={formData.year}
                    price={formData.price_per_day}
                    onYearChange={(value) => setFormData({ ...formData, year: value })}
                    onPriceChange={(value) => setFormData({ ...formData, price_per_day: value })}
                  />
                </div>
              </div>
              
              {/* Spécifications */}
              <div>
                <h3 className="text-lg font-medium mb-4">Spécifications techniques</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <VehicleSpecs
                    transmission={formData.transmission}
                    fuel={formData.fuel_type}
                    onTransmissionChange={(value) => setFormData({ ...formData, transmission: value })}
                    onFuelChange={(value) => setFormData({ ...formData, fuel_type: value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Nombre de places</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.seats}
                        onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                        placeholder="ex: 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Couleur</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="ex: Noir"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Localisation */}
              <div>
                <h3 className="text-lg font-medium mb-4">Localisation</h3>
                <LocationInput
                  location={formData.location}
                  onLocationChange={(value) => setFormData({ ...formData, location: value })}
                />
              </div>
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-medium mb-4">Description</h3>
                <VehicleDescription
                  description={formData.description}
                  onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
                />
              </div>
              
              {/* Photos */}
              <div>
                <h3 className="text-lg font-medium mb-4">Photos</h3>
                <ImageUpload onImagesChange={handleImagesChange} initialImages={images} />
              </div>
              
              {/* Actions */}
              <div className="flex justify-end pt-6 border-t">
                <Button 
                  type="submit" 
                  disabled={loading || submitting}
                  className="min-w-[150px]"
                >
                  {loading || submitting ? "Envoi en cours..." : "Ajouter le véhicule"}
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
