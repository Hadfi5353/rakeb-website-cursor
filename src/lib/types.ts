
export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  location: string;
  description?: string;
  transmission: 'manual' | 'automatic';
  fuel: 'diesel' | 'essence' | 'hybrid' | 'electric';
  image_url?: string;
  owner_id: string;
  created_at: string;
  longitude: number;
  latitude: number;
  
  // Nouvelles propriétés
  category: 'SUV' | 'Berline' | 'Sportive' | 'Luxe' | 'Électrique' | 'Familiale';
  rating: number;
  reviews_count: number;
  isPremium: boolean;
  available_units?: number;
  views_count?: number;
  features?: string[];
  last_booking?: string;
  
  // Added properties to fix TypeScript errors
  trips?: number;
  seats?: number;
};
