// Add your Supabase type definitions here
export type Tables = {
  users: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'owner' | 'renter' | 'admin';
    created_at: string;
    updated_at: string;
  };
  vehicles: {
    id: string;
    owner_id: string;
    make: string;
    model: string;
    year: number;
    price_per_day: number;
    location: string;
    description: string;
    images: string[];
    fuel_type: string;
    luggage: number;
    mileage: number;
    color: string;
    transmission: 'automatic' | 'manual';
    seats: number;
    features: string[];
    rating?: number;
    reviews_count?: number;
    status: 'available' | 'rented' | 'maintenance';
    created_at: string;
    updated_at: string;
  };
  bookings: {
    id: string;
    vehicle_id: string;
    renter_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    updated_at: string;
  };
  documents: {
    id: string;
    user_id: string;
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
  };
};

export type Database = {
  public: {
    Tables: {
      [K in keyof Tables]: {
        Row: Tables[K];
      };
    };
  };
}; 