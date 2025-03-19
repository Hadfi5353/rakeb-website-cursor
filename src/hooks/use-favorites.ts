import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Favorite {
  id: string;
  vehicleId: string;
  car: string;
  location: string;
  price: number;
  rating: number;
  disponible: boolean;
}

interface VehicleData {
  id: string;
  make: string;
  model: string;
  year: number;
  location: string;
  price_per_day: number;
  rating: number;
  status: string;
}

interface FavoriteRecord {
  id: string;
  vehicle_id: string;
  vehicles: VehicleData | null;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const getFavorites = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Fetching favorites for user:', user.id);
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          id,
          vehicle_id,
          vehicles!inner (
            id,
            make,
            model,
            year,
            location,
            price_per_day,
            rating,
            status
          )
        `)
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;

      console.log('Received favorites data:', favoritesData);

      const formattedFavorites: Favorite[] = (favoritesData as FavoriteRecord[])
        .filter(f => f.vehicles) // Filter out any null vehicles
        .map(f => ({
          id: f.id,
          vehicleId: f.vehicle_id,
          car: `${f.vehicles!.make} ${f.vehicles!.model} ${f.vehicles!.year}`,
          location: f.vehicles!.location,
          price: f.vehicles!.price_per_day,
          rating: f.vehicles!.rating || 0,
          disponible: f.vehicles!.status === 'available'
        }));

      console.log('Formatted favorites:', formattedFavorites);
      setFavorites(formattedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger les favoris au montage et quand l'utilisateur change
  useEffect(() => {
    if (user) {
      getFavorites();
    } else {
      setFavorites([]);
    }
  }, [user, getFavorites]);

  const toggleFavorite = useCallback(async (vehicleId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour gérer vos favoris');
      return false;
    }

    try {
      const isFav = favorites.some(f => f.vehicleId === vehicleId);
      
      if (isFav) {
        // Supprimer des favoris
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('vehicle_id', vehicleId);

        if (error) throw error;
        toast.success('Retiré des favoris');
      } else {
        // Ajouter aux favoris en utilisant upsert
        const { error } = await supabase
          .from('favorites')
          .upsert(
            { user_id: user.id, vehicle_id: vehicleId },
            { onConflict: 'user_id,vehicle_id' }
          );

        if (error) throw error;
        toast.success('Ajouté aux favoris');
      }

      // Rafraîchir la liste des favoris
      await getFavorites();
      return true;
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
      toast.error('Impossible de modifier vos favoris');
      return false;
    }
  }, [user, favorites, getFavorites]);

  const isFavorite = useCallback((vehicleId: string) => {
    return favorites.some(f => f.vehicleId === vehicleId);
  }, [favorites]);

  return {
    favorites,
    loading,
    getFavorites,
    toggleFavorite,
    isFavorite
  };
}; 