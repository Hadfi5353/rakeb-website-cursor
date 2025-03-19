import { useState, useCallback, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<OwnerBooking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<OwnerBooking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<OwnerBooking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<OwnerBooking[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [error, setError] = useState<any>(null);

  // Récupérer les réservations du propriétaire
  const getOwnerBookings = useCallback(async () => {
    if (!user) {
      console.log('Aucun utilisateur connecté pour récupérer les réservations');
      return [];
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Récupération des réservations pour le propriétaire:', user.id);
      console.log('Utilisateur actuel:', user);
      
      // Vérifier si l'utilisateur est un propriétaire
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);
        
      if (vehiclesError) {
        console.error('Erreur lors de la vérification des véhicules:', vehiclesError);
        throw vehiclesError;
      }
      
      if (!vehiclesData || vehiclesData.length === 0) {
        console.log('Cet utilisateur n\'a pas de véhicules enregistrés');
        toast.error('Vous n\'avez pas de véhicules enregistrés. Ajoutez un véhicule pour recevoir des réservations.');
        setLoading(false);
        return [];
      }
      
      // Récupérer les réservations avec les détails des véhicules et des locataires
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          vehicle_id,
          renter_id,
          owner_id,
          start_date,
          end_date,
          status,
          total_price,
          base_price,
          service_fee,
          insurance_fee,
          duration_days,
          created_at,
          vehicles (
            id,
            make,
            model,
            year,
            images
          ),
          profiles:renter_id (
            id,
            first_name,
            last_name,
            email,
            avatar_url,
            phone
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        console.error('Détails de l\'erreur:', error.message, error.details, error.hint);
        toast.error('Impossible de récupérer vos demandes de réservation');
        setError(error);
        if (props?.onError) props.onError(error);
        setLoading(false);
        return [];
      }

      console.log('Réservations récupérées:', data?.length || 0);
      console.log('Données brutes des réservations:', data);
      
      // Vérifier si des données ont été retournées
      if (!data || data.length === 0) {
        console.log('Aucune réservation trouvée pour ce propriétaire');
        setBookings([]);
        setPendingBookings([]);
        setConfirmedBookings([]);
        setCompletedBookings([]);
        setCancelledBookings([]);
        setLoading(false);
        return [];
      }
      
      // Transformer les données pour correspondre au format attendu par les composants
      const formattedBookings: OwnerBooking[] = data?.map(booking => {
        console.log('Traitement de la réservation:', booking.id);
        console.log('Données du véhicule:', booking.vehicles);
        console.log('Données du locataire:', booking.profiles);
        
        return {
          id: booking.id,
          vehicleId: booking.vehicle_id,
          renterId: booking.renter_id,
          ownerId: booking.owner_id,
          startDate: booking.start_date,
          endDate: booking.end_date,
          status: booking.status,
          totalAmount: booking.total_price || 0,
          durationDays: booking.duration_days || 0,
          createdAt: booking.created_at,
          vehicle: booking.vehicles ? {
            id: booking.vehicles.id,
            make: booking.vehicles.make,
            model: booking.vehicles.model,
            year: booking.vehicles.year,
            image: booking.vehicles.images?.[0] || undefined
          } : undefined,
          renter: booking.profiles ? {
            id: booking.profiles.id,
            firstName: booking.profiles.first_name,
            lastName: booking.profiles.last_name,
            email: booking.profiles.email,
            avatar: booking.profiles.avatar_url,
            phone: booking.profiles.phone
          } : undefined
        };
      }) || [];

      console.log('Réservations formatées:', formattedBookings);

      // Filtrer les réservations par statut
      const pending = formattedBookings.filter(b => b.status === 'pending');
      const confirmed = formattedBookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress');
      const completed = formattedBookings.filter(b => b.status === 'completed');
      const cancelled = formattedBookings.filter(b => b.status === 'cancelled' || b.status === 'rejected');

      console.log('Réservations en attente:', pending.length);
      console.log('Réservations confirmées:', confirmed.length);
      console.log('Réservations terminées:', completed.length);
      console.log('Réservations annulées/refusées:', cancelled.length);

      setBookings(formattedBookings);
      setPendingBookings(pending);
      setConfirmedBookings(confirmed);
      setCompletedBookings(completed);
      setCancelledBookings(cancelled);

      // Récupérer le nombre de notifications non lues
      const { count, error: notifError } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (!notifError) {
        setUnreadNotifications(count || 0);
      }

      return formattedBookings;
    } catch (error) {
      console.error('Exception lors de la récupération des réservations:', error);
      toast.error('Une erreur est survenue lors de la récupération de vos réservations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Configurer la souscription aux changements de réservations
  useEffect(() => {
    if (!user) return;

    console.log('Configuration de la souscription aux réservations pour le propriétaire:', user.id);
    
    const bookingsSubscription = supabase
      .channel('owner-bookings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `owner_id=eq.${user.id}`
      }, (payload) => {
        console.log('Changement détecté dans les réservations:', payload);
        
        // Rafraîchir les réservations immédiatement
        getOwnerBookings();
        
        // Afficher une notification selon le type d'événement
        switch (payload.eventType) {
          case 'INSERT':
            toast.success('Nouvelle demande de réservation reçue');
            break;
          case 'UPDATE':
            const newStatus = payload.new.status;
            const oldStatus = payload.old.status;
            
            if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
              toast.info('Une réservation a été annulée par le locataire');
            } else if (newStatus === 'confirmed' && oldStatus === 'pending') {
              toast.success('Réservation confirmée avec succès');
            } else if (newStatus === 'rejected' && oldStatus === 'pending') {
              toast.info('Réservation refusée avec succès');
            }
            break;
        }
      })
      .subscribe();

    // Charger les réservations au montage
    getOwnerBookings();

    // Nettoyer la souscription lors du démontage
    return () => {
      console.log('Nettoyage de la souscription aux réservations');
      bookingsSubscription.unsubscribe();
    };
  }, [user, getOwnerBookings]);

  // Accepter une réservation
  const acceptBooking = useCallback(async (bookingId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour gérer les réservations');
      return false;
    }

    setLoading(true);
    try {
      console.log('Acceptation de la réservation:', bookingId);
      
      // Mettre à jour le statut de la réservation
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('owner_id', user.id); // Vérifier que l'utilisateur est bien le propriétaire

      if (error) {
        console.error('Erreur lors de l\'acceptation de la réservation:', error);
        toast.error('Impossible d\'accepter cette réservation');
        return false;
      }

      // Créer une notification pour le locataire
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        await supabase
          .from('notifications')
          .insert({
            user_id: booking.renterId,
            type: 'booking_confirmed',
            title: 'Réservation acceptée',
            message: `Votre réservation pour ${booking.vehicle?.make} ${booking.vehicle?.model} a été acceptée.`,
            related_id: bookingId,
            is_read: false
          });
      }

      toast.success('Réservation acceptée avec succès');
      
      // Mettre à jour la liste des réservations
      await getOwnerBookings();
      return true;
    } catch (error) {
      console.error('Exception lors de l\'acceptation de la réservation:', error);
      toast.error('Une erreur est survenue lors de l\'acceptation de la réservation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, bookings, getOwnerBookings]);

  // Refuser une réservation
  const rejectBooking = useCallback(async (bookingId: string, reason?: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour gérer les réservations');
      return false;
    }

    setLoading(true);
    try {
      console.log('Refus de la réservation:', bookingId);
      
      // Mettre à jour le statut de la réservation
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('owner_id', user.id); // Vérifier que l'utilisateur est bien le propriétaire

      if (error) {
        console.error('Erreur lors du refus de la réservation:', error);
        toast.error('Impossible de refuser cette réservation');
        return false;
      }

      // Créer une notification pour le locataire
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        await supabase
          .from('notifications')
          .insert({
            user_id: booking.renterId,
            type: 'booking_rejected',
            title: 'Réservation refusée',
            message: `Votre réservation pour ${booking.vehicle?.make} ${booking.vehicle?.model} a été refusée.${reason ? ` Raison: ${reason}` : ''}`,
            related_id: bookingId,
            is_read: false
          });
      }

      toast.success('Réservation refusée avec succès');
      
      // Mettre à jour la liste des réservations
      await getOwnerBookings();
      return true;
    } catch (error) {
      console.error('Exception lors du refus de la réservation:', error);
      toast.error('Une erreur est survenue lors du refus de la réservation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, bookings, getOwnerBookings]);

  // Marquer les notifications comme lues
  const markNotificationsAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (!error) {
        setUnreadNotifications(0);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
    }
  }, [user]);

  return {
    loading,
    bookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    unreadNotifications,
    getOwnerBookings,
    acceptBooking,
    rejectBooking,
    markNotificationsAsRead
  };
}; 