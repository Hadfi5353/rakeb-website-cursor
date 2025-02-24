
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, MapPin, Star } from "lucide-react";

interface Favorite {
  id: number;
  car: string;
  location: string;
  price: number;
  rating: number;
  disponible: boolean;
}

interface FavoritesListProps {
  favorites: Favorite[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLocationFilter: (value: string) => void;
  onPriceFilter: (value: string) => void;
}

export const FavoritesList = ({
  favorites,
  searchTerm,
  onSearchChange,
  onLocationFilter,
  onPriceFilter,
}: FavoritesListProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Véhicules favoris</CardTitle>
          <div className="flex gap-2">
            <Select onValueChange={onLocationFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Casablanca">Casablanca</SelectItem>
                <SelectItem value="Rabat">Rabat</SelectItem>
                <SelectItem value="Marrakech">Marrakech</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={onPriceFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">≤ 800 Dh</SelectItem>
                <SelectItem value="medium">801-1200 Dh</SelectItem>
                <SelectItem value="high">{">"} 1200 Dh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Input
          placeholder="Rechercher un véhicule..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{favorite.car}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {favorite.location}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                      {favorite.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{favorite.price} Dh/jour</p>
                <span className={`text-xs ${favorite.disponible ? 'text-green-600' : 'text-red-600'}`}>
                  {favorite.disponible ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
