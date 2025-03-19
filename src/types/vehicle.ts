export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'unavailable';
export type VehicleTransmission = 'automatic' | 'manual' | 'semi-automatic';
export type VehicleFuelType = 'diesel' | 'essence' | 'hybrid' | 'electric';
export type VehicleCategory = 'SUV' | 'Berline' | 'Sportive' | 'Luxe' | 'Électrique' | 'Familiale' | 'Compacte' | 'Utilitaire';

export interface Vehicle {
  id: string;
  owner_id: string;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  location: string;
  description?: string;
  images: string[];
  status: VehicleStatus;
  fuel_type?: VehicleFuelType;
  luggage?: number;
  mileage?: number;
  color?: string;
  transmission?: VehicleTransmission;
  seats?: number;
  features?: string[];
  rating?: number;
  reviews_count?: number;
  category?: VehicleCategory;
  latitude?: number;
  longitude?: number;
  is_premium?: boolean;
  created_at: string;
  updated_at: string;

  // Propriétés supplémentaires pour compatibilité avec l'ancien code
  brand?: string; // Alias pour make
  price?: number; // Alias pour price_per_day
  name?: string;  // Généralement construit à partir de make + model + year
  image_url?: string; // Premier élément de images
}

export interface VehicleSearch {
  location?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: VehicleCategory;
}

export interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  location: string;
  description?: string;
  images: string[];
  fuel_type?: VehicleFuelType;
  luggage?: number;
  mileage?: number;
  color?: string;
  transmission?: VehicleTransmission;
  seats?: number;
  features?: string[];
  category?: VehicleCategory;
  latitude?: number;
  longitude?: number;
  is_premium?: boolean;
}

export interface VehicleAvailability {
  isAvailable: boolean;
  alternativeDates?: {
    startDate: string;
    endDate: string;
  }[];
}

// Helper functions
export const getVehicleName = (vehicle: Vehicle): string => {
  return `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
};

export const getVehicleImage = (vehicle: Vehicle): string => {
  return vehicle.images && vehicle.images.length > 0 
    ? vehicle.images[0] 
    : vehicle.image_url || '/placeholder-car.jpg';
};

export const formatVehicleData = (vehicle: any): Vehicle => {
  // Assurer une compatibilité entre les différentes sources de données
  return {
    ...vehicle,
    brand: vehicle.make || vehicle.brand,
    price: vehicle.price_per_day || vehicle.price,
    name: getVehicleName(vehicle),
    image_url: getVehicleImage(vehicle)
  };
}; 