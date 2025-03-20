import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BookingStatus } from '@/types';

export interface OwnerBooking {
  id: string;
  vehicleId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalAmount: number;
  createdAt: string;
  durationDays: number;
  
  // Informations sur le véhicule
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    image?: string;
  };
  
  // Informations sur le locataire
  renter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    phone?: string;
  };
}

interface UseOwnerBookingsProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useOwnerBookings = (props?: UseOwnerBookingsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Requête pour récupérer les réservations
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['owner-bookings'],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicles(*),
          renter:profiles!renter_id(*)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    onSuccess: props?.onSuccess,
    onError: props?.onError
  });

  // Souscription aux changements en temps réel
  useEffect(() => {
    if (!user || isSubscribed) return;

    const subscription = supabase
      .channel('owner-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `owner_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Changement détecté dans les réservations:', payload);
          
          // Rafraîchir les données
          await queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
          
          // Notification pour les nouvelles réservations
          if (payload.eventType === 'INSERT') {
            toast.info('Nouvelle demande de réservation reçue');
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

  return {
    bookings,
    isLoading,
    error,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['owner-bookings'] })
  };
}; 