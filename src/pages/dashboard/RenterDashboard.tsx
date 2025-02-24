
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
  History
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";

const mockReservations = [
  {
    id: 1,
    car: "Mercedes Classe C",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    status: "En cours",
    price: 2500,
  },
  {
    id: 2,
    car: "BMW Série 3",
    startDate: "2024-04-01",
    endDate: "2024-04-05",
    status: "À venir",
    price: 3000,
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
  },
  {
    id: 2,
    car: "Volkswagen Golf",
    date: "Janvier 2024",
    duration: "3 jours",
    price: 1500,
    rating: 4,
  },
];

const mockFavorites = [
  {
    id: 1,
    car: "Mercedes Classe E",
    location: "Casablanca",
    price: 800,
  },
  {
    id: 2,
    car: "BMW X5",
    location: "Rabat",
    price: 1000,
  },
];

const RenterDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord - Locataire</h1>
        
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Prix</TableHead>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Véhicules favoris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFavorites.map((favorite) => (
                  <div key={favorite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Car className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{favorite.car}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {favorite.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{favorite.price} Dh/jour</p>
                      <Button variant="link" size="sm" className="text-gray-500">
                        Voir les détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Historique des locations</CardTitle>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistory.map((history) => (
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
