import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BookingStatus } from '@/types/booking';

export interface RenterBooking {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  total_price: number;
  base_price: number;
  service_fee: number;
  pickup_location: string;
  return_location: string;
  duration_days: number;
  created_at: string;
  
  // Vehicle details
  vehicle?: {
    make: string;
    model: string;
    year: number;
    images: string[];
    owner_id: string;
  };
  
  // Owner details
  owner?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

export const useRenterBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Requête pour récupérer les réservations
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['renter-bookings'],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicles(*),
          owner:profiles!owner_id(*)
        `)
        .eq('renter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Souscription aux changements en temps réel
  useEffect(() => {
    if (!user || isSubscribed) return;

    const subscription = supabase
      .channel('renter-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `renter_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Changement détecté dans les réservations:', payload);
          
          // Rafraîchir les données
          await queryClient.invalidateQueries({ queryKey: ['renter-bookings'] });
          
          // Notifications selon le type de changement
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new.status;
            switch (newStatus) {
              case 'confirmed':
                toast.success('Votre réservation a été acceptée !');
                break;
              case 'rejected':
                toast.error('Votre réservation a été refusée');
                break;
              case 'cancelled':
                toast.info('Votre réservation a été annulée');
                break;
            }
          }
        }
      )
      .subscribe();

    setIsSubscribed(true);

    return () => {
      subscription.unsubscribe();
      setIsSubscribed(false);
    };
  }, [user, queryClient, isSubscribed]);

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('renter_id', user?.id);

      if (error) throw error;

      toast.success('Réservation annulée avec succès');
      await queryClient.invalidateQueries({ queryKey: ['renter-bookings'] });
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      toast.error('Impossible d\'annuler la réservation');
    }
  };

  return {
    bookings,
    isLoading,
    error,
    cancelBooking,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['renter-bookings'] })
  };
}; 