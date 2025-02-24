
import { useState } from "react";
import CarCard from "./cars/CarCard";
import ReservationDialog from "./cars/ReservationDialog";

const cars = [
  {
    id: 1,
    name: "Dacia Duster",
    image: "/placeholder.svg",
    price: "250",
    location: "Casablanca",
    rating: 4.8,
    reviews: 24,
    features: ["Climatisation", "5 places", "Bluetooth", "GPS"],
    insurance: "Tous risques incluse",
    minDuration: "3 jours",
  },
  {
    id: 2,
    name: "Renault Clio",
    image: "/placeholder.svg",
    price: "200",
    location: "Rabat",
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 3,
    name: "Volkswagen Golf",
    image: "/placeholder.svg",
    price: "300",
    location: "Marrakech",
    rating: 4.7,
    reviews: 32,
  },
];

const PopularCars = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReservation = (car) => {
    setSelectedCar(car);
    setIsDialogOpen(true);
  };

  return (
    <section id="popular" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Véhicules populaires
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les véhicules les plus appréciés par notre communauté
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <div
              key={car.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CarCard car={car} onReserve={handleReservation} />
            </div>
          ))}
        </div>
      </div>

      {selectedCar && (
        <ReservationDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          car={selectedCar}
        />
      )}
    </section>
  );
};

export default PopularCars;
