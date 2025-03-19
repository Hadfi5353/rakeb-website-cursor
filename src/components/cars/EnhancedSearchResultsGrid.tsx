import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck } from "lucide-react";
import CarCard from "@/components/cars/CarCard";
import { Vehicle } from "@/lib/types";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface EnhancedSearchResultsGridProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
}

const EnhancedSearchResultsGrid = ({ vehicles, isLoading = false }: EnhancedSearchResultsGridProps) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    favorites: dbFavorites, 
    toggleFavorite, 
    isFavorite,
    getFavorites
  } = useFavorites();

  // Synchroniser les favoris avec la base de données au chargement
  useEffect(() => {
    if (user) {
      const favIds = new Set<string>();
      dbFavorites.forEach(fav => {
        if (fav.vehicleId) {
          favIds.add(fav.vehicleId);
        }
      });
      setFavorites(favIds);
    }
  }, [user, dbFavorites]);

  const addToFavorites = async (carId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter des favoris");
      navigate('/auth/login');
      return;
    }

    try {
      const success = await toggleFavorite(carId);
      if (success) {
        const newFavorites = new Set(favorites);
        
        if (favorites.has(carId)) {
          newFavorites.delete(carId);
        } else {
          newFavorites.add(carId);
        }
        
        setFavorites(newFavorites);
        
        // Rafraîchir la liste des favoris pour mettre à jour le tableau de bord
        await getFavorites();
      }
    } catch (error) {
      console.error("Erreur lors de la modification des favoris:", error);
      toast.error("Une erreur est survenue lors de la modification des favoris");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-t-xl" />
            <div className="bg-white p-4 rounded-b-xl space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-10 bg-gray-200 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {vehicles.map((car) => (
        <div 
          key={car.id} 
          className="relative group transform hover:scale-[1.02] transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
              favorites.has(car.id) ? 'text-red-500' : 'opacity-0 group-hover:opacity-100'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              addToFavorites(car.id);
            }}
          >
            <Heart className={`w-4 h-4 ${favorites.has(car.id) ? 'fill-current' : ''}`} />
          </Button>
          
          {car.isPremium && (
            <div className="absolute top-2 left-2 z-10 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Premium
            </div>
          )}
          
          <CarCard
            car={{
              id: car.id,
              name: car.name || `${car.brand || car.make} ${car.model} ${car.year}`,
              image: car.image_url || "/placeholder.svg",
              price: `${car.price || car.price_per_day}`,
              location: car.location,
              rating: car.rating || 4.5,
              reviews: car.reviews_count || 0,
              insurance: car.isPremium ? "Assurance tous risques incluse" : undefined
            }}
            onReserve={() => console.log("Réserver:", car)}
          />
        </div>
      ))}
    </div>
  );
};

export default EnhancedSearchResultsGrid; 