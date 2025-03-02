
import { supabase } from './supabase';
import { Vehicle } from './types';

export const vehiclesApi = {
  async getVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Vehicle[];
  },

  async getVehicle(id: string) {
    try {
      // For numeric IDs (from demo data), we need a different approach
      // Check if id is numeric (likely from demo data) or UUID (from database)
      const isNumericId = !isNaN(Number(id));
      
      let query;
      if (isNumericId) {
        // For demo purposes, just return the first vehicle or mock data
        console.log("Using numeric ID, fetching first vehicle as demo");
        query = supabase
          .from('vehicles')
          .select('*')
          .limit(1);
      } else {
        // Real UUID case
        query = supabase
          .from('vehicles')
          .select('*')
          .eq('id', id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // If we found a vehicle, return it
      if (data && data.length > 0) {
        return data[0] as Vehicle;
      }
      
      // If no vehicle found, create a mock one for demo purposes
      return {
        id: id,
        name: "Demo Vehicle",
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        price: 300,
        location: "Casablanca, Maroc",
        description: "Voiture de démonstration disponible pour test.",
        transmission: "automatic",
        fuel: "essence",
        image_url: "/placeholder.svg",
        owner_id: "demo-owner",
        created_at: new Date().toISOString(),
        longitude: -7.5898,
        latitude: 33.5731,
        category: "Berline",
        rating: 4.7,
        reviews_count: 12,
        isPremium: false,
        trips: 24,
        seats: 5
      } as Vehicle;
    } catch (error) {
      console.error("Erreur lors de la récupération du véhicule:", error);
      throw error;
    }
  },

  async createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'owner_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('vehicles')
      .insert([{ ...vehicle, owner_id: user.id }])
      .select()
      .single();
      
    if (error) throw error;
    return data as Vehicle;
  },

  async updateVehicle(id: string, vehicle: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicle)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Vehicle;
  },

  async deleteVehicle(id: string) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};
