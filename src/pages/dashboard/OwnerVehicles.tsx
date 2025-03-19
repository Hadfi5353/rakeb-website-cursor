import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";
import { useVehicle } from "@/hooks/use-vehicle";
import { Vehicle } from "@/lib/types";

const OwnerVehicles = () => {
  const { getOwnerVehicles, vehicles, loading } = useVehicle();

  useEffect(() => {
    getOwnerVehicles();
  }, [getOwnerVehicles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos véhicules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Mes véhicules</h1>
          </div>
          <Link to="/cars/add">
            <Button variant="default" size="sm" className="flex items-center gap-2 font-medium">
              <Plus className="h-4 w-4" />
              Ajouter un véhicule
            </Button>
          </Link>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-4 py-8">
        {vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle: Vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={vehicle.image_url || "/placeholder.svg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {vehicle.brand} {vehicle.model} {vehicle.year}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Car className="w-4 h-4 mr-1" />
                    {vehicle.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {vehicle.price_per_day} DH/jour
                    </span>
                    <Link to={`/cars/${vehicle.id}`}>
                      <Button variant="outline" size="sm">
                        Voir les détails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucun véhicule</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore ajouté de véhicule à votre flotte.
            </p>
            <Link to="/cars/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un véhicule
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerVehicles; 