
import { useState } from "react";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { ReservationsTable } from "@/components/dashboard/ReservationsTable";
import { FavoritesList } from "@/components/dashboard/FavoritesList";
import { RentalHistory } from "@/components/dashboard/RentalHistory";

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
      (filterPrice === "medium" && (favorite.price > 800 && favorite.price <= 1200)) ||
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
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord - Locataire</h1>
        </div>

        <div className="mb-8">
          <SearchBar />
        </div>

        <StatsCards
          activeReservations={mockReservations.filter(r => r.status === "En cours").length}
          favoritesCount={mockFavorites.length}
          totalRentals={mockHistory.length}
        />

        <UsageChart data={usageStats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReservationsTable
            reservations={mockReservations}
            onRenewal={handleQuickRenewal}
          />

          <FavoritesList
            favorites={filteredFavorites}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onLocationFilter={setFilterLocation}
            onPriceFilter={setFilterPrice}
          />

          <RentalHistory
            history={sortedHistory}
            onSortChange={setHistorySort}
            onRate={handleRating}
          />
        </div>
      </div>
    </div>
  );
};

export default RenterDashboard;
