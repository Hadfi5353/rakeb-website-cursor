
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck } from "lucide-react";
import CarCard from "@/components/cars/CarCard";
import { Vehicle } from "@/lib/types";
import { toast } from "sonner";

interface SearchResultsGridProps {
  vehicles: Vehicle[];
}

const SearchResultsGrid = ({ vehicles }: SearchResultsGridProps) => {
  const addToFavorites = (carId: string) => {
    toast.success("Véhicule ajouté aux favoris");
  };

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
            className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={() => addToFavorites(car.id)}
          >
            <Heart className="w-4 h-4" />
          </Button>
          
          {car.isPremium && (
            <div className="absolute top-2 left-2 z-10 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Premium
            </div>
          )}
          
          <CarCard
            car={{
              id: Number(car.id),
              name: `${car.brand} ${car.model} ${car.year}`,
              image: car.image_url || "/placeholder.svg",
              price: `${car.price}`,
              location: car.location,
              rating: car.rating,
              reviews: car.reviews_count,
              insurance: "Assurance tous risques incluse"
            }}
            onReserve={() => console.log("Réserver:", car)}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchResultsGrid;
