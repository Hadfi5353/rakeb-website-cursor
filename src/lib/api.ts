import { supabase } from './supabase';
import { Vehicle } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Booking, BookingRequest, BookingResponse, BookingActionResponse } from '@/types/booking';

export const vehiclesApi = {
  async getVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Vehicle[];
  },

  async searchVehicles(params: {
    location?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    transmission?: string;
    fuelType?: string;
    minSeats?: number;
    isPremium?: boolean;
  }) {
    try {
      console.log("Recherche de véhicules avec les paramètres:", params);
      
      // Construire la requête de base
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available');
      
      // Ajouter les filtres si présents
      if (params.location) {
        query = query.ilike('location', `%${params.location}%`);
      }
      
      if (params.category && params.category !== 'Toutes') {
        query = query.eq('category', params.category);
      }
      
      if (params.minPrice !== undefined) {
        query = query.gte('price_per_day', params.minPrice);
      }
      
      if (params.maxPrice !== undefined) {
        query = query.lte('price_per_day', params.maxPrice);
      }
      
      if (params.transmission && params.transmission !== 'all') {
        query = query.eq('transmission', params.transmission);
      }
      
      if (params.fuelType && params.fuelType !== 'all') {
        query = query.eq('fuel_type', params.fuelType);
      }
      
      if (params.minSeats !== undefined) {
        query = query.gte('seats', params.minSeats);
      }
      
      if (params.isPremium !== undefined) {
        query = query.eq('is_premium', params.isPremium);
      }
      
      // Exécuter la requête
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error("Erreur lors de la recherche de véhicules:", error);
        throw error;
      }
      
      // Formater les résultats
      const formattedVehicles = data.map(vehicle => ({
        ...vehicle,
        brand: vehicle.make,
        price: vehicle.price_per_day,
        name: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
        image_url: vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : '/placeholder.svg',
        fuel: vehicle.fuel_type,
        isPremium: vehicle.is_premium,
        features: vehicle.features || [],
      }));
      
      console.log(`${formattedVehicles.length} véhicules trouvés`);
      return formattedVehicles as Vehicle[];
      
    } catch (error) {
      console.error("Erreur détaillée lors de la recherche de véhicules:", error);
      throw error;
    }
  },

  async getVehicle(id: string) {
    try {
      console.log("Tentative de récupération du véhicule avec l'ID:", id);

      // Récupérer uniquement les données du véhicule sans aucune jointure
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (vehicleError) {
        console.error("Erreur lors de la récupération du véhicule:", vehicleError);
        throw vehicleError;
      }
      
      if (!vehicleData) {
        console.error("Aucun véhicule trouvé avec l'ID:", id);
        throw new Error("Véhicule non trouvé");
      }

      // Créer un objet propriétaire fictif pour éviter toute récursion
      const mockOwner = {
        id: vehicleData.owner_id,
        first_name: "Propriétaire",
        last_name: "",
        avatar_url: null,
        rating: 4.5,
        total_reviews: 10
      };

      // Formater le résultat
      const formattedVehicle = {
        ...vehicleData,
        brand: vehicleData.make,
        price: vehicleData.price_per_day,
        name: `${vehicleData.make} ${vehicleData.model} ${vehicleData.year}`,
        image_url: vehicleData.images && vehicleData.images.length > 0 ? vehicleData.images[0] : '/placeholder.svg',
        fuel: vehicleData.fuel_type,
        isPremium: vehicleData.is_premium,
        status: vehicleData.status || 'available',
        features: vehicleData.features || [],
        owner: mockOwner,
        rating: vehicleData.rating || 0,
        reviews_count: vehicleData.reviews_count || 0
      };

      console.log("Véhicule formaté:", formattedVehicle);
      return formattedVehicle;
      
    } catch (error) {
      console.error("Erreur détaillée lors de la récupération du véhicule:", error);
      throw error;
    }
  },

  async createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'owner_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    // S'assurer que tous les champs obligatoires sont présents
    const vehicleData: any = {
      ...vehicle,
      owner_id: user.id,
      status: vehicle.status || 'available',
    };

    // Adaptation des champs pour compatibilité avec la base de données
    if ('price' in vehicleData && !vehicleData.price_per_day) {
      vehicleData.price_per_day = vehicleData.price;
    }
    if ('brand' in vehicleData && !vehicleData.make) {
      vehicleData.make = vehicleData.brand;
    }

    console.log("Données du véhicule à créer:", vehicleData);

    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();
      
    if (error) {
      console.error("Erreur lors de la création du véhicule:", error);
      throw error;
    }
    
    console.log("Véhicule créé avec succès:", data);
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

export const bookingsApi = {
  // Récupérer les réservations d'un locataire
  async getRenterBookings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(
          make,
          model,
          year,
          images,
          owner_id
        ),
        owner:profiles!vehicles(owner_id)!inner(
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('renter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  },

  // Créer une nouvelle réservation
  async createBooking(request: BookingRequest): Promise<BookingResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...request,
        renter_id: user.id,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      bookingId: data.id
    };
  },

  // Annuler une réservation
  async cancelBooking(bookingId: string): Promise<BookingActionResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('renter_id', user.id) // Sécurité: vérifier que l'utilisateur est bien le locataire
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'Réservation annulée avec succès'
    };
  },

  // Mettre à jour le statut d'une réservation
  async updateBookingStatus(bookingId: string, status: string): Promise<BookingActionResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'Statut mis à jour avec succès'
    };
  }
};
