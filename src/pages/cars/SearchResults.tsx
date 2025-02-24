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
  Heart,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CategoryButton from "@/components/cars/CategoryButton";
import AdvancedFilters from "@/components/cars/AdvancedFilters";
import MapPin from "@/components/ui/map-pin";

const carCategories = [
  "Toutes", "SUV", "Berline", "Sportive", "Luxe", "Électrique", "Familiale"
];

const exampleVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Mercedes GLC 300",
    brand: "Mercedes",
    model: "GLC",
    year: 2023,
    price: 890,
    location: "Casablanca Centre",
    description: "SUV luxueux avec intérieur cuir et toit panoramique",
    transmission: "automatic",
    fuel: "essence",
    image_url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800",
    owner_id: "1",
    created_at: new Date().toISOString(),
    longitude: -7.589843,
    latitude: 33.573109,
    category: "SUV",
    rating: 4.8,
    reviews_count: 24,
    isPremium: true,
    available_units: 1,
    features: ["Cuir", "GPS", "Toit ouvrant", "Bluetooth"]
  },
  {
    id: "2",
    name: "BMW Série 5",
    brand: "BMW",
    model: "530i",
    year: 2023,
    price: 950,
    location: "Marrakech Guéliz",
    description: "Berline sportive avec pack M Sport",
    transmission: "automatic",
    fuel: "essence",
    image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800",
    owner_id: "2",
    created_at: new Date().toISOString(),
    longitude: -8.008889,
    latitude: 31.631794,
    category: "Berline",
    rating: 4.9,
    reviews_count: 32,
    isPremium: true,
    available_units: 2,
    features: ["Pack M Sport", "Sièges chauffants", "CarPlay", "Harman Kardon"]
  },
  {
    id: "3",
    name: "Tesla Model 3",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 780,
    location: "Rabat Agdal",
    description: "Véhicule électrique performant avec Autopilot",
    transmission: "automatic",
    fuel: "electric",
    image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800",
    owner_id: "3",
    created_at: new Date().toISOString(),
    longitude: -6.849813,
    latitude: 33.991589,
    category: "Électrique",
    rating: 4.7,
    reviews_count: 18,
    isPremium: true,
    available_units: 1,
    features: ["Autopilot", "Toit en verre", "Supercharge", "Premium Audio"]
  }
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const availableBrands = Array.from(new Set(exampleVehicles.map(v => v.brand)));

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getVehicles,
  });

  useEffect(() => {
    let filtered = [...exampleVehicles];
    
    const location = searchParams.get("location")?.toLowerCase();
    
    if (location) {
      filtered = filtered.filter(v => 
        v.location.toLowerCase().includes(location)
      );
    }

    if (selectedBrand && selectedBrand !== "all") {
      filtered = filtered.filter(v => v.brand === selectedBrand);
    }

    if (selectedTransmission && selectedTransmission !== "all") {
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
  }, [searchParams, selectedBrand, selectedTransmission, selectedCategory, priceRange, minRating, showPremiumOnly]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 relative transform hover:scale-[1.02] transition-transform duration-300">
          <SearchBar />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur-xl" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <div className="space-y-1 w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {filteredVehicles.length} véhicules trouvés
            </h1>
            {searchParams.get("location") && (
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                à {searchParams.get("location")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-lg w-full sm:w-auto">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1 sm:flex-none transition-all duration-300 hover:scale-105"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="ml-2">Grille</span>
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
              className="flex-1 sm:flex-none transition-all duration-300 hover:scale-105"
            >
              <MapIcon className="w-4 h-4" />
              <span className="ml-2">Carte</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-64 space-y-6">
            <Card className="p-4 sm:p-6 backdrop-blur-xl bg-white/80 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Catégorie
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {carCategories.map((category) => (
                      <CategoryButton
                        key={category}
                        category={category}
                        isSelected={selectedCategory === category}
                        onClick={() => setSelectedCategory(category)}
                      />
                    ))}
                  </div>
                </div>

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
                        className="flex-1 transition-all duration-300 hover:scale-[1.02]"
                      >
                        {rating > 0 ? (
                          <div className="flex items-center gap-1">
                            {rating}
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                        ) : (
                          "Tous"
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtres avancés
                  </div>
                  {showAdvancedFilters ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                {showAdvancedFilters && (
                  <AdvancedFilters
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                    selectedTransmission={selectedTransmission}
                    setSelectedTransmission={setSelectedTransmission}
                    showPremiumOnly={showPremiumOnly}
                    setShowPremiumOnly={setShowPremiumOnly}
                    availableBrands={availableBrands}
                  />
                )}
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

            <Card className="p-4 sm:p-6 backdrop-blur-xl bg-white/80 border-0 shadow-lg space-y-4 hidden lg:block">
              <h3 className="font-medium text-gray-900">Tendances actuelles</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-primary/90 bg-primary/5 p-3 rounded-lg transform hover:scale-[1.02] transition-all cursor-default">
                  <Users className="w-4 h-4" />
                  <span>12 personnes consultent cette recherche</span>
                </div>
                <div className="flex items-center gap-2 text-orange-500/90 bg-orange-500/5 p-3 rounded-lg transform hover:scale-[1.02] transition-all cursor-default">
                  <Clock className="w-4 h-4" />
                  <span>Dernière réservation il y a 5 min</span>
                </div>
                <div className="flex items-center gap-2 text-rose-500/90 bg-rose-500/5 p-3 rounded-lg transform hover:scale-[1.02] transition-all cursor-default">
                  <TrendingUp className="w-4 h-4" />
                  <span>Prix en hausse pour ces dates</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex-1">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredVehicles.map((car) => (
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
            ) : (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl h-[600px] flex items-center justify-center border-0 shadow-lg">
                <p className="text-gray-500">Carte en cours de développement</p>
              </div>
            )}

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-xl border-0 shadow-lg">
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
