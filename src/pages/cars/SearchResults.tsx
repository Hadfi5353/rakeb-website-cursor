
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
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "@/components/SearchBar";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");

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

    filtered = filtered.filter(v => 
      v.price >= priceRange[0] && v.price <= priceRange[1]
    );

    setFilteredVehicles(filtered);
  }, [vehicles, searchParams, selectedBrand, selectedTransmission, priceRange]);

  const handleReserve = (car: Vehicle) => {
    // La logique de réservation sera implémentée plus tard
    console.log("Réserver:", car);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres */}
          <div className="w-full md:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filtres
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prix par jour
                  </label>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      step={50}
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
                  <label className="block text-sm font-medium mb-2">
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
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedBrand("");
                setSelectedTransmission("");
                setPriceRange([0, 1000]);
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {filteredVehicles.length} véhicules trouvés
              </h1>
              {searchParams.get("location") && (
                <p className="text-gray-600">
                  à {searchParams.get("location")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((car) => (
                <CarCard
                  key={car.id}
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
                  onReserve={() => handleReserve(car)}
                />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
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
