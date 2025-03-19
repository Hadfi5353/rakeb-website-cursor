import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Vehicle, VehicleFormData, VehicleSearch, VehicleAvailability } from '@/types/vehicle';
import { useToast } from '@/components/ui/use-toast';

interface UseVehicleProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useVehicle = (props?: UseVehicleProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  const { onSuccess, onError } = props || {};

  /**
   * Récupère tous les véhicules disponibles avec filtres optionnels
   */
  const getAvailableVehicles = useCallback(async (searchParams?: VehicleSearch) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construire les paramètres pour la fonction RPC
      const params: Record<string, any> = {};
      
      if (searchParams) {
        if (searchParams.location) params.location_filter = searchParams.location;
        if (searchParams.minPrice) params.min_price = searchParams.minPrice;
        if (searchParams.maxPrice) params.max_price = searchParams.maxPrice;
        if (searchParams.category) params.category_filter = searchParams.category;
        if (searchParams.startDate) params.start_date = searchParams.startDate;
        if (searchParams.endDate) params.end_date = searchParams.endDate;
      }
      
      // Appeler la fonction RPC
      const { data, error: rpcError } = await supabase
        .rpc('get_available_vehicles', params);
      
      if (rpcError) throw rpcError;
      
      // Formater les résultats
      const formattedVehicles = (data as Vehicle[]).map(vehicle => ({
        ...vehicle,
        brand: vehicle.make,
        price: vehicle.price_per_day,
        name: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
        image_url: vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : undefined
      }));
      
      setVehicles(formattedVehicles);
      
      if (onSuccess) onSuccess(formattedVehicles);
      return formattedVehicles;
      
    } catch (err: any) {
      console.error("Erreur lors de la récupération des véhicules:", err);
      const errorMsg = err.message || "Impossible de récupérer les véhicules disponibles";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg,
      });
      
      if (onError) onError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast, onSuccess, onError]);

  /**
   * Récupère les véhicules d'un propriétaire
   */
  const getOwnerVehicles = useCallback(async () => {
    try {
      if (!user) {
        throw new Error("Vous devez être connecté pour accéder à vos véhicules");
      }
      
      setLoading(true);
      setError(null);
      
      // Appeler la fonction RPC
      const { data, error: rpcError } = await supabase
        .rpc('get_owner_vehicles');
      
      if (rpcError) throw rpcError;
      
      // Formater les résultats
      const formattedVehicles = (data as Vehicle[]).map(vehicle => ({
        ...vehicle,
        brand: vehicle.make,
        price: vehicle.price_per_day,
        name: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
        image_url: vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : undefined
      }));
      
      setVehicles(formattedVehicles);
      
      if (onSuccess) onSuccess(formattedVehicles);
      return formattedVehicles;
      
    } catch (err: any) {
      console.error("Erreur lors de la récupération des véhicules du propriétaire:", err);
      const errorMsg = err.message || "Impossible de récupérer vos véhicules";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg,
      });
      
      if (onError) onError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, toast, onSuccess, onError]);

  /**
   * Récupère les détails d'un véhicule spécifique
   */
  const getVehicleById = useCallback(async (vehicleId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (!data) {
        throw new Error("Véhicule non trouvé");
      }
      
      // Formater le résultat
      const formattedVehicle = {
        ...data,
        brand: data.make,
        price: data.price_per_day,
        name: `${data.make} ${data.model} ${data.year}`,
        image_url: data.images && data.images.length > 0 ? data.images[0] : undefined
      } as Vehicle;
      
      setCurrentVehicle(formattedVehicle);
      
      if (onSuccess) onSuccess(formattedVehicle);
      return formattedVehicle;
      
    } catch (err: any) {
      console.error("Erreur lors de la récupération du véhicule:", err);
      const errorMsg = err.message || "Impossible de récupérer les détails du véhicule";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg,
      });
      
      if (onError) onError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, onSuccess, onError]);

  /**
   * Crée un nouveau véhicule
   */
  const createVehicle = useCallback(async (vehicleData: VehicleFormData) => {
    try {
      if (!user) {
        throw new Error("Vous devez être connecté pour ajouter un véhicule");
      }
      
      setLoading(true);
      setError(null);
      
      console.log("Données véhicule envoyées:", vehicleData);
      
      // Appeler la fonction RPC
      const { data, error: rpcError } = await supabase
        .rpc('create_vehicle_v2', {
          p_make: vehicleData.make,
          p_model: vehicleData.model,
          p_year: vehicleData.year,
          p_price_per_day: vehicleData.price_per_day,
          p_location: vehicleData.location,
          p_description: vehicleData.description || null,
          p_images: vehicleData.images || [],
          p_fuel_type: vehicleData.fuel_type || null,
          p_luggage: vehicleData.luggage || null,
          p_mileage: vehicleData.mileage || null,
          p_color: vehicleData.color || null,
          p_transmission: vehicleData.transmission || null,
          p_seats: vehicleData.seats || null,
          p_features: vehicleData.features || [],
          p_category: vehicleData.category || null,
          p_latitude: vehicleData.latitude || null,
          p_longitude: vehicleData.longitude || null,
          p_is_premium: vehicleData.is_premium || false,
        });
      
      if (rpcError) {
        console.error("Erreur RPC:", rpcError);
        throw rpcError;
      }
      
      // Formater le résultat
      const newVehicle = data as Vehicle;
      console.log("Véhicule créé:", newVehicle);
      
      toast({
        title: "Véhicule ajouté",
        description: "Votre véhicule a été ajouté avec succès",
      });
      
      if (onSuccess) onSuccess(newVehicle);
      return newVehicle;
      
    } catch (err: any) {
      console.error("Erreur lors de la création du véhicule:", err);
      const errorMsg = err.message || "Impossible d'ajouter le véhicule";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg,
      });
      
      if (onError) onError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast, onSuccess, onError]);

  /**
   * Met à jour un véhicule existant
   */
  const updateVehicle = useCallback(async (vehicleId: string, updates: Partial<VehicleFormData>) => {
    try {
      if (!user) {
        throw new Error("Vous devez être connecté pour modifier un véhicule");
      }
      
      setLoading(true);
      setError(null);
      
      // Vérifier que l'utilisateur est bien le propriétaire du véhicule
      const { data: vehicleData, error: checkError } = await supabase
        .from('vehicles')
        .select('owner_id')
        .eq('id', vehicleId)
        .single();
      
      if (checkError) throw checkError;
      
      if (!vehicleData || vehicleData.owner_id !== user.id) {
        throw new Error("Vous n'êtes pas autorisé à modifier ce véhicule");
      }
      
      // Effectuer la mise à jour
      const { data, error: updateError } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', vehicleId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Formater le résultat
      const updatedVehicle = {
        ...data,
        brand: data.make,
        price: data.price_per_day,
        name: `${data.make} ${data.model} ${data.year}`,
        image_url: data.images && data.images.length > 0 ? data.images[0] : undefined
      } as Vehicle;
      
      setCurrentVehicle(updatedVehicle);
      
      toast({
        title: "Véhicule mis à jour",
        description: "Votre véhicule a été mis à jour avec succès",
      });
      
      if (onSuccess) onSuccess(updatedVehicle);
      return updatedVehicle;
      
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du véhicule:", err);
      const errorMsg = err.message || "Impossible de mettre à jour le véhicule";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg,
      });
      
      if (onError) onError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast, onSuccess, onError]);

  /**
   * Supprime un véhicule
   */
  const deleteVehicle = useCallback(async (vehicleId: string) => {
    try {
      if (!user) {
        throw new Error("Vous devez être connecté pour supprimer un véhicule");
      }
      
      setLoading(true);
      setError(null);
      
      // Vérifier que l'utilisateur est bien le propriétaire du véhicule
      const { data: vehicleData, error: checkError } = await supabase
        .from('vehicles')
        .select('owner_id')
        .eq('id', vehicleId)
        .single();
      
      if (checkError) throw checkError;
      
      if (!vehicleData || vehicleData.owner_id !== user.id) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce véhicule");
      }
      
      // Effectuer la suppression
      const { error: deleteError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: "Véhicule supprimé",
        description: "Votre véhicule a été supprimé avec succès",
      });
      
      if (onSuccess) onSuccess({ id: vehicleId });
      return true;
      
    } catch (err: any) {
      console.error("Erreur lors de la suppression du véhicule:", err);
      const errorMsg = err.message || "Impossible de supprimer le véhicule";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg,
      });
      
      if (onError) onError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast, onSuccess, onError]);

  /**
   * Vérifie la disponibilité d'un véhicule pour des dates spécifiques
   */
  const checkVehicleAvailability = useCallback(async (
    vehicleId: string,
    startDate: string,
    endDate: string
  ): Promise<VehicleAvailability> => {
    try {
      setLoading(true);
      
      // Vérifier la disponibilité avec la fonction RPC
      const { data: isAvailable, error: availabilityError } = await supabase
        .rpc('check_vehicle_availability', {
          p_vehicle_id: vehicleId,
          p_start_date: startDate,
          p_end_date: endDate
        });
      
      if (availabilityError) throw availabilityError;
      
      // Si le véhicule n'est pas disponible, chercher des dates alternatives
      if (!isAvailable) {
        const { data: alternatives, error: alternativesError } = await supabase
          .rpc('find_alternative_dates', {
            p_vehicle_id: vehicleId,
            p_requested_start_date: startDate,
            p_requested_end_date: endDate,
            p_days_range: 14
          });
        
        if (alternativesError) throw alternativesError;
        
        return {
          isAvailable: false,
          alternativeDates: alternatives
        };
      }
      
      return { isAvailable: true };
      
    } catch (err: any) {
      console.error("Erreur lors de la vérification de disponibilité:", err);
      const errorMsg = err.message || "Impossible de vérifier la disponibilité du véhicule";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMsg,
      });
      
      if (onError) onError(err);
      return { isAvailable: false };
    } finally {
      setLoading(false);
    }
  }, [toast, onError]);

  return {
    loading,
    error,
    vehicles,
    currentVehicle,
    getAvailableVehicles,
    getOwnerVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    checkVehicleAvailability
  };
}; 