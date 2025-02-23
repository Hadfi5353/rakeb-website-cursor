
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
};
