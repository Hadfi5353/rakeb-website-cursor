
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "@/lib/api";
import { Vehicle } from "@/lib/types";
import CarCard from "@/components/cars/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  SlidersHorizontal, 
  Star, 
  Map as MapIcon,
  LayoutGrid,
  Users,
  Clock,
  TrendingUp,
  ShieldCheck,
  Heart 
} from "lucide-react";
import SearchBar from "@/components/SearchBar";

const carCategories = [
  "Toutes", "SUV", "Berline", "Sportive", "Luxe", "Électrique", "Familiale"
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [minRating, setMinRating] = useState(0);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getVehicles,
  });

  useEffect(() => {
    if (!vehicles) return;

    let filtered = [...vehicles];
    const location = searchParams.get("location")?.toLowerCase();
    
    if (location) {
      filtered = filtered.filter(v => 
        v.location.toLowerCase().includes(location)
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(v => v.brand === selectedBrand);
    }

    if (selectedTransmission) {
      filtered = filtered.filter(v => v.transmission === selectedTransmission);
    }

    if (selectedCategory !== "Toutes") {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    filtered = filtered.filter(v => 
      v.price >= priceRange[0] && v.price <= priceRange[1]
    );

    if (minRating > 0) {
      filtered = filtered.filter(v => (v.rating || 0) >= minRating);
    }

    if (showPremiumOnly) {
      filtered = filtered.filter(v => v.isPremium);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchParams, selectedBrand, selectedTransmission, selectedCategory, priceRange, minRating, showPremiumOnly]);

  const addToFavorites = (carId: string) => {
    toast.success("Véhicule ajouté aux favoris");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-white/50 backdrop-blur-lg rounded-xl w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-white/50 backdrop-blur-lg rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* En-tête des résultats */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {filteredVehicles.length} véhicules trouvés
            </h1>
            {searchParams.get("location") && (
              <p className="text-gray-600">
                à {searchParams.get("location")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <MapIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres */}
          <div className="w-full md:w-64 space-y-6">
            <Card className="p-6 backdrop-blur-xl bg-white/80">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2 text-primary" />
                Filtres
              </h2>

              <div className="space-y-6">
                {/* Catégories */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Catégorie
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {carCategories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="text-xs"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Prix par jour
                  </label>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      step={50}
                      className="my-6"
                    />
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                        className="w-24"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>

                {/* Note minimale */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Note minimale
                  </label>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinRating(rating)}
                        className="flex-1"
                      >
                        {rating > 0 ? (
                          <div className="flex items-center">
                            {rating}
                            <Star className="w-3 h-3 ml-1 fill-current" />
                          </div>
                        ) : (
                          "Tous"
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Options
                  </label>
                  <Button
                    variant={showPremiumOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                    className="w-full justify-start"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Véhicules Premium uniquement
                  </Button>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Transmission
                  </label>
                  <Select
                    value={selectedTransmission}
                    onValueChange={setSelectedTransmission}
                  >
                    <option value="">Toutes</option>
                    <option value="manual">Manuelle</option>
                    <option value="automatic">Automatique</option>
                  </Select>
                </div>

                {/* Marque */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Marque
                  </label>
                  <Select
                    value={selectedBrand}
                    onValueChange={setSelectedBrand}
                  >
                    <option value="">Toutes les marques</option>
                    {Array.from(new Set(vehicles?.map(v => v.brand))).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </Select>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => {
                  setSelectedBrand("");
                  setSelectedTransmission("");
                  setSelectedCategory("Toutes");
                  setPriceRange([0, 1000]);
                  setMinRating(0);
                  setShowPremiumOnly(false);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </Card>

            {/* Statistiques en temps réel */}
            <Card className="p-6 backdrop-blur-xl bg-white/80">
              <h3 className="font-medium mb-4">Statistiques en direct</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="w-4 h-4" />
                  <span>12 personnes consultent cette recherche</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="w-4 h-4" />
                  <span>Dernière réservation il y a 5 min</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span>Prix en hausse pour ces dates</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((car) => (
                  <div key={car.id} className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => addToFavorites(car.id)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <CarCard
                      car={{
                        id: Number(car.id),
                        name: `${car.brand} ${car.model} ${car.year}`,
                        image: car.image_url || "/placeholder.svg",
                        price: `${car.price}`,
                        location: car.location,
                        rating: 4.5,
                        reviews: 12,
                        insurance: "Assurance tous risques incluse"
                      }}
                      onReserve={() => console.log("Réserver:", car)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl h-[600px] flex items-center justify-center">
                <p className="text-gray-500">Carte en cours de développement</p>
              </div>
            )}

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-xl">
                <h2 className="text-xl font-semibold mb-2">
                  Aucun véhicule trouvé
                </h2>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
