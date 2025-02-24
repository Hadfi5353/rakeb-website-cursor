import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MapPin,
  Calendar,
  Search,
  Car,
  Clock,
  Heart,
  Star,
  History,
  Filter,
  ChevronDown,
  RotateCw,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";

const usageStats = [
  { mois: 'Jan', locations: 2 },
  { mois: 'Fév', locations: 3 },
  { mois: 'Mars', locations: 1 },
  { mois: 'Avr', locations: 4 },
  { mois: 'Mai', locations: 2 },
  { mois: 'Juin', locations: 3 },
];

const mockReservations = [
  {
    id: 1,
    car: "Mercedes Classe C",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    status: "En cours",
    price: 2500,
    location: "Casablanca"
  },
  {
    id: 2,
    car: "BMW Série 3",
    startDate: "2024-04-01",
    endDate: "2024-04-05",
    status: "À venir",
    price: 3000,
    location: "Rabat"
  },
];

const mockHistory = [
  {
    id: 1,
    car: "Audi A4",
    date: "Février 2024",
    duration: "5 jours",
    price: 2800,
    rating: 5,
    location: "Marrakech"
  },
  {
    id: 2,
    car: "Volkswagen Golf",
    date: "Janvier 2024",
    duration: "3 jours",
    price: 1500,
    rating: 4,
    location: "Tanger"
  },
];

const mockFavorites = [
  {
    id: 1,
    car: "Mercedes Classe E",
    location: "Casablanca",
    price: 800,
    rating: 4.5,
    disponible: true,
  },
  {
    id: 2,
    car: "BMW X5",
    location: "Rabat",
    price: 1000,
    rating: 4.8,
    disponible: false,
  },
];

const RenterDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterLocation, setFilterLocation] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [historySort, setHistorySort] = useState("date");

  const handleQuickRenewal = (reservation: typeof mockReservations[0]) => {
    toast.success(`Demande de renouvellement envoyée pour ${reservation.car}`);
  };

  const handleRating = (historyItem: typeof mockHistory[0], rating: number) => {
    toast.success(`Note de ${rating}/5 enregistrée pour ${historyItem.car}`);
  };

  const filteredFavorites = mockFavorites.filter(favorite => {
    const matchesSearch = favorite.car.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || favorite.location === filterLocation;
    const matchesPrice = !filterPrice || 
      (filterPrice === "low" && favorite.price <= 800) ||
      (filterPrice === "medium" && favorite.price > 800 && favorite.price <= 1200) ||
      (filterPrice === "high" && favorite.price > 1200);
    
    return matchesSearch && matchesLocation && matchesPrice;
  });

  const sortedHistory = [...mockHistory].sort((a, b) => {
    if (historySort === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (historySort === "price") {
      return b.price - a.price;
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord - Locataire</h1>
          <div className="mt-4 md:mt-0">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Réservations en cours</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReservations.filter(r => r.status === "En cours").length}</div>
              <p className="text-xs text-gray-500">Véhicules actuellement loués</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Favoris</CardTitle>
              <Heart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockFavorites.length}</div>
              <p className="text-xs text-gray-500">Véhicules sauvegardés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total des locations</CardTitle>
              <History className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockHistory.length}</div>
              <p className="text-xs text-gray-500">Locations effectuées</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Statistiques d'utilisation</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="locations" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Réservations</CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Calendrier
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.car}</TableCell>
                      <TableCell>
                        {reservation.startDate} - {reservation.endDate}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reservation.status === "En cours" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {reservation.status}
                        </span>
                      </TableCell>
                      <TableCell>{reservation.price} Dh</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleQuickRenewal(reservation)}
                        >
                          <RotateCw className="h-4 w-4 mr-2" />
                          Renouveler
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Véhicules favoris</CardTitle>
                <div className="flex gap-2">
                  <Select onValueChange={setFilterLocation}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casablanca">Casablanca</SelectItem>
                      <SelectItem value="Rabat">Rabat</SelectItem>
                      <SelectItem value="Marrakech">Marrakech</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setFilterPrice}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Prix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">≤ 800 Dh</SelectItem>
                      <SelectItem value="medium">801-1200 Dh</SelectItem>
                      <SelectItem value="high">> 1200 Dh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Input
                placeholder="Rechercher un véhicule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFavorites.map((favorite) => (
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

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Historique des locations</CardTitle>
              <Select onValueChange={setHistorySort} defaultValue="date">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="rating">Note</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Prix total</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">{history.car}</TableCell>
                      <TableCell>{history.date}</TableCell>
                      <TableCell>{history.duration}</TableCell>
                      <TableCell>{history.price} Dh</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1">{history.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Noter
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <DropdownMenuItem 
                                key={rating}
                                onClick={() => handleRating(history, rating)}
                              >
                                <div className="flex items-center">
                                  {Array.from({ length: rating }).map((_, i) => (
                                    <Star 
                                      key={i}
                                      className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1"
                                    />
                                  ))}
                                  <span className="ml-2">{rating} étoile{rating > 1 ? 's' : ''}</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RenterDashboard;
