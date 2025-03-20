import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Booking,
  BookingRequest,
  BookingResponse,
  BookingActionResponse,
  VehicleChecklist,
  BookingStatus
} from '@/types';

interface UseBookingProps {
  onSuccess?: (booking: Booking) => void;
  onError?: (error: string) => void;
}

export const useBooking = (props?: UseBookingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  /**
   * Récupérer une réservation par son ID
   */
  const getBookingById = useCallback(async (id: string): Promise<Booking | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicles(*),
          renter:profiles!renter_id(*),
          owner:profiles!owner_id(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Conversion du format snake_case vers camelCase
      const formattedBooking: Booking = {
        id: data.id,
        vehicleId: data.vehicle_id,
        renterId: data.renter_id,
        ownerId: data.owner_id,
        vehicle: data.vehicle,
        renter: data.renter,
        owner: data.owner,
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        pickupLocation: data.pickup_location,
        returnLocation: data.return_location,
        status: data.status,
        basePrice: data.base_price,
        insuranceFee: data.insurance_fee,
        serviceFee: data.service_fee,
        totalPrice: data.total_price,
        depositAmount: data.deposit_amount,
        paymentStatus: data.payment_status,
        paymentId: data.payment_id,
        contactShared: data.contact_shared,
        pickupContractSigned: data.pickup_contract_signed,
        pickupChecklist: data.pickup_checklist,
        pickupPhotos: data.pickup_photos || [],
        returnContractSigned: data.return_contract_signed,
        returnChecklist: data.return_checklist,
        returnPhotos: data.return_photos || [],
        renterNotes: data.renter_notes,
        ownerNotes: data.owner_notes
      };
      
      setBooking(formattedBooking);
      return formattedBooking;
    } catch (error: any) {
      console.error("Erreur lors de la récupération de la réservation:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les détails de la réservation."
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  /**
   * Récupérer toutes les réservations d'un propriétaire (via ses véhicules)
   */
  const getOwnerBookings = useCallback(async (
    status?: BookingStatus
  ): Promise<Booking[]> => {
    try {
      setLoading(true);
      console.log(`[getOwnerBookings] Début de la récupération des réservations du propriétaire`);
      
      if (!user) {
        console.error("[getOwnerBookings] Erreur: Utilisateur non authentifié");
        throw new Error("Utilisateur non authentifié");
      }
      
      console.log("[getOwnerBookings] Récupération des véhicules du propriétaire:", user.id);
      
      // Étape 1: Récupérer tous les véhicules du propriétaire
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('owner_id', user.id);
      
      if (vehiclesError) {
        console.error("[getOwnerBookings] Erreur lors de la récupération des véhicules:", vehiclesError);
        throw vehiclesError;
      }
      
      if (!vehicles || vehicles.length === 0) {
        console.log("[getOwnerBookings] Aucun véhicule trouvé pour le propriétaire:", user.id);
        setBookings([]);
        return [];
      }
      
      const vehicleIds = vehicles.map(v => v.id);
      console.log(`[getOwnerBookings] ${vehicleIds.length} véhicules trouvés pour le propriétaire`);
      
      // Étape 2: Récupérer toutes les réservations pour ces véhicules
      let query = supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicles(id, make, model, year, price_per_day, location, images),
          renter:profiles!renter_id(id, first_name, last_name, avatar_url, phone, email),
          owner:profiles!owner_id(id, first_name, last_name, avatar_url, phone, email)
        `)
        .in('vehicle_id', vehicleIds)
        .order('created_at', { ascending: false });
      
      // Filtrer par statut si spécifié
      if (status) {
        console.log(`[getOwnerBookings] Filtrage par statut: ${status}`);
        query = query.eq('status', status);
      }
      
      console.log("[getOwnerBookings] Exécution de la requête Supabase pour les réservations...");
      const { data, error } = await query;
      
      if (error) {
        console.error("[getOwnerBookings] Erreur Supabase:", error);
        throw error;
      }
      
      console.log(`[getOwnerBookings] ${data?.length || 0} réservations récupérées pour les véhicules du propriétaire`);
      
      if (!data || data.length === 0) {
        console.log(`[getOwnerBookings] Aucune réservation trouvée pour les véhicules du propriétaire ${user.id}`);
        setBookings([]);
        return [];
      }
      
      // Convertir les réservations au format camelCase
      console.log("[getOwnerBookings] Formatage des réservations...");
      const formattedBookings: Booking[] = data.map(booking => {
        // Calculer le nom du véhicule
        const vehicleName = booking.vehicle ? 
          `${booking.vehicle.make || ''} ${booking.vehicle.model || ''}`.trim() :
          'Véhicule inconnu';
          
        // Récupérer les noms des personnes
        const renterName = booking.renter ? 
          `${booking.renter.first_name || ''} ${booking.renter.last_name || ''}`.trim() :
          'Locataire inconnu';
          
        const ownerName = booking.owner ? 
          `${booking.owner.first_name || ''} ${booking.owner.last_name || ''}`.trim() :
          'Propriétaire inconnu';
        
        // Récupérer l'image du véhicule
        let vehicleImageUrl = '';
        if (booking.vehicle && booking.vehicle.images && Array.isArray(booking.vehicle.images) && booking.vehicle.images.length > 0) {
          vehicleImageUrl = booking.vehicle.images[0];
        } else if (booking.vehicle && booking.vehicle.images && typeof booking.vehicle.images === 'string') {
          try {
            // Essayer de parser si c'est une chaîne JSON
            const parsedImages = JSON.parse(booking.vehicle.images);
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              vehicleImageUrl = parsedImages[0];
            }
          } catch (e) {
            // Ignorer les erreurs de parsing
          }
        }
        
        // Calculer la durée en jours
        let durationDays = 1;
        if (booking.duration_days) {
          durationDays = booking.duration_days;
        } else if (booking.start_date && booking.end_date) {
          const startDate = new Date(booking.start_date);
          const endDate = new Date(booking.end_date);
          durationDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
        }
        
        // Calculer le tarif journalier
        let dailyRate = 0;
        if (booking.base_price) {
          dailyRate = booking.base_price / durationDays;
        } else if (booking.vehicle && booking.vehicle.price_per_day) {
          dailyRate = booking.vehicle.price_per_day;
        }
          
        return {
          id: booking.id,
          vehicleId: booking.vehicle_id,
          vehicleName: vehicleName,
          vehicleBrand: booking.vehicle?.make || '',
          vehicleModel: booking.vehicle?.model || '',
          vehicleYear: booking.vehicle?.year || '',
          vehicleImageUrl: vehicleImageUrl,
          
          renterId: booking.renter_id,
          renterName: renterName,
          renterEmail: booking.renter?.email || '',
          renterPhone: booking.renter?.phone || '',
          
          ownerId: booking.owner_id,
          ownerName: ownerName,
          ownerEmail: booking.owner?.email || '',
          ownerPhone: booking.owner?.phone || '',
          
          startDate: booking.start_date,
          endDate: booking.end_date,
          pickupLocation: booking.pickup_location || '',
          returnLocation: booking.return_location || '',
          
          status: booking.status,
          
          dailyRate: dailyRate,
          durationDays: durationDays,
          serviceFee: booking.service_fee || 0,
          totalAmount: booking.total_price || 0,
          depositAmount: booking.deposit_amount || 0,
          
          createdAt: booking.created_at,
          updatedAt: booking.updated_at,
          
          // Autres propriétés
          pickupChecklist: booking.pickup_checklist,
          pickupPhotos: booking.pickup_photos || [],
          returnChecklist: booking.return_checklist, 
          returnPhotos: booking.return_photos || [],
        };
      });
      
      console.log(`[getOwnerBookings] ${formattedBookings.length} réservations formatées pour le propriétaire`);
      setBookings(formattedBookings);
      return formattedBookings;
    } catch (error: any) {
      console.error("[getOwnerBookings] Erreur lors de la récupération des réservations:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer vos réservations."
      });
      return [];
    } finally {
      console.log("[getOwnerBookings] Fin de la récupération des réservations, loading = false");
      setLoading(false);
    }
  }, [user, toast]);
  
  /**
   * Récupérer toutes les réservations d'un utilisateur (en tant que locataire ou propriétaire)
   */
  const getUserBookings = useCallback(async (
    role: 'renter' | 'owner' = 'renter',
    status?: BookingStatus
  ): Promise<Booking[]> => {
    try {
      setLoading(true);
      console.log(`[getUserBookings] Début de la récupération des réservations (rôle: ${role})`);
      
      if (!user) {
        console.error("[getUserBookings] Erreur: Utilisateur non authentifié");
        throw new Error("Utilisateur non authentifié");
      }
      
      console.log(`[getUserBookings] Récupération des réservations en tant que ${role} pour l'utilisateur:`, user.id);
      
      // Utiliser la fonction appropriée selon le rôle
      if (role === 'owner') {
        // Pour les propriétaires, utiliser getOwnerBookings
        console.log("[getUserBookings] Délégation à getOwnerBookings pour les réservations du propriétaire");
        const ownerBookings = await getOwnerBookings(status);
        console.log(`[getUserBookings] ${ownerBookings.length} réservations récupérées pour le propriétaire`);
        return ownerBookings;
      } else {
        // Pour les locataires, récupérer directement leurs réservations
        console.log("[getUserBookings] Récupération directe des réservations du locataire:", user.id);
        let query = supabase
          .from('bookings')
          .select(`
            *,
            vehicle:vehicles(id, make, model, year, price_per_day, location, images),
            renter:profiles!renter_id(id, first_name, last_name, avatar_url, phone, email),
            owner:profiles!owner_id(id, first_name, last_name, avatar_url, phone, email)
          `)
          .eq('renter_id', user.id)
          .order('created_at', { ascending: false });
        
        // Filtrer par statut si spécifié
        if (status) {
          console.log(`[getUserBookings] Filtrage par statut: ${status}`);
          query = query.eq('status', status);
        }
        
        console.log("[getUserBookings] Exécution de la requête Supabase pour les réservations du locataire...");
        const { data, error } = await query;
        
        if (error) {
          console.error("[getUserBookings] Erreur Supabase:", error);
          throw error;
        }
        
        console.log("[getUserBookings] Nombre de réservations récupérées pour le locataire:", data?.length || 0);
        
        if (!data || data.length === 0) {
          console.log(`[getUserBookings] Aucune réservation trouvée pour le locataire ${user.id}`);
          setBookings([]);
          return [];
        }
        
        // Convertir les réservations au format camelCase
        console.log("[getUserBookings] Formatage des réservations du locataire...");
        const formattedBookings: Booking[] = data.map(booking => {
          // Calculer le nom du véhicule
          const vehicleName = booking.vehicle ? 
            `${booking.vehicle.make || ''} ${booking.vehicle.model || ''}`.trim() :
            'Véhicule inconnu';
            
          // Récupérer les noms des personnes
          const renterName = booking.renter ? 
            `${booking.renter.first_name || ''} ${booking.renter.last_name || ''}`.trim() :
            'Locataire inconnu';
            
          const ownerName = booking.owner ? 
            `${booking.owner.first_name || ''} ${booking.owner.last_name || ''}`.trim() :
            'Propriétaire inconnu';
          
          // Récupérer l'image du véhicule
          let vehicleImageUrl = '';
          if (booking.vehicle && booking.vehicle.images && Array.isArray(booking.vehicle.images) && booking.vehicle.images.length > 0) {
            vehicleImageUrl = booking.vehicle.images[0];
          } else if (booking.vehicle && booking.vehicle.images && typeof booking.vehicle.images === 'string') {
            try {
              // Essayer de parser si c'est une chaîne JSON
              const parsedImages = JSON.parse(booking.vehicle.images);
              if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                vehicleImageUrl = parsedImages[0];
              }
            } catch (e) {
              // Ignorer les erreurs de parsing
            }
          }
          
          // Calculer la durée en jours
          let durationDays = 1;
          if (booking.duration_days) {
            durationDays = booking.duration_days;
          } else if (booking.start_date && booking.end_date) {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);
            durationDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
          }
          
          // Calculer le tarif journalier
          let dailyRate = 0;
          if (booking.base_price) {
            dailyRate = booking.base_price / durationDays;
          } else if (booking.vehicle && booking.vehicle.price_per_day) {
            dailyRate = booking.vehicle.price_per_day;
          }
            
          return {
            id: booking.id,
            vehicleId: booking.vehicle_id,
            vehicleName: vehicleName,
            vehicleBrand: booking.vehicle?.make || '',
            vehicleModel: booking.vehicle?.model || '',
            vehicleYear: booking.vehicle?.year || '',
            vehicleImageUrl: vehicleImageUrl,
            
            renterId: booking.renter_id,
            renterName: renterName,
            renterEmail: booking.renter?.email || '',
            renterPhone: booking.renter?.phone || '',
            
            ownerId: booking.owner_id,
            ownerName: ownerName,
            ownerEmail: booking.owner?.email || '',
            ownerPhone: booking.owner?.phone || '',
            
            startDate: booking.start_date,
            endDate: booking.end_date,
            pickupLocation: booking.pickup_location || '',
            returnLocation: booking.return_location || '',
            
            status: booking.status,
            
            dailyRate: dailyRate,
            durationDays: durationDays,
            serviceFee: booking.service_fee || 0,
            totalAmount: booking.total_price || 0,
            depositAmount: booking.deposit_amount || 0,
            
            createdAt: booking.created_at,
            updatedAt: booking.updated_at,
            
            // Autres propriétés
            pickupChecklist: booking.pickup_checklist,
            pickupPhotos: booking.pickup_photos || [],
            returnChecklist: booking.return_checklist, 
            returnPhotos: booking.return_photos || [],
          };
        });
        
        console.log(`[getUserBookings] ${formattedBookings.length} réservations formatées pour le locataire`);
        setBookings(formattedBookings);
        return formattedBookings;
      }
    } catch (error: any) {
      console.error("[getUserBookings] Erreur lors de la récupération des réservations:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer vos réservations."
      });
      return [];
    } finally {
      console.log("[getUserBookings] Fin de la récupération des réservations, loading = false");
      setLoading(false);
    }
  }, [user, toast, getOwnerBookings]);
  
  /**
   * Fonction pour vérifier la disponibilité d'un véhicule
   */
  const checkVehicleAvailability = async (vehicleId: string, startDate: string, endDate: string): Promise<boolean> => {
    try {
      // Vérifier les réservations existantes qui se chevauchent
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .in('status', ['pending', 'confirmed', 'in_progress'])
        .or(
          `and(start_date.lte.${endDate},end_date.gte.${startDate}),` + // Chevauchement complet
          `and(start_date.gte.${startDate},start_date.lte.${endDate}),` + // Début pendant la période
          `and(end_date.gte.${startDate},end_date.lte.${endDate})` // Fin pendant la période
        );

      if (error) {
        console.error("Erreur lors de la vérification de la disponibilité:", error);
        throw error;
      }

      // Si des réservations existent pour cette période, le véhicule n'est pas disponible
      if (existingBookings && existingBookings.length > 0) {
        console.log("Réservations existantes trouvées:", existingBookings);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de la disponibilité:", error);
      return false;
    }
  };
  
  /**
   * Fonction pour créer une réservation qui vérifie la disponibilité du véhicule
   */
  const createBookingRequest = useCallback(async (
    request: BookingRequest
  ): Promise<BookingResponse> => {
    try {
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      // Vérifier la disponibilité du véhicule
      const isAvailable = await checkVehicleAvailability(
        request.vehicleId,
        request.startDate,
        request.endDate
      );

      if (!isAvailable) {
        throw new Error("Ce véhicule n'est pas disponible pour les dates sélectionnées");
      }

      // Récupérer les informations du véhicule et du propriétaire
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select(`
          *,
          owner:profiles!owner_id(*)
        `)
        .eq('id', request.vehicleId)
        .single();

      if (vehicleError) {
        console.error("Erreur lors de la récupération du véhicule:", vehicleError);
        throw vehicleError;
      }

      const ownerId = vehicleData.owner_id;
      const durationDays = calculateDurationDays(request.startDate, request.endDate);
      const basePrice = vehicleData.price_per_day * durationDays;
      const insuranceFee = calculateInsuranceFee(basePrice, request.insuranceOption);
      const serviceFee = Math.round(basePrice * 0.1); // 10% de frais de service
      const totalPrice = basePrice + insuranceFee + serviceFee;
      const depositAmount = vehicleData.security_deposit || Math.round(basePrice * 0.3);

      // Insérer la réservation dans la base de données
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          vehicle_id: request.vehicleId,
          renter_id: user.id,
          owner_id: ownerId,
          start_date: request.startDate,
          end_date: request.endDate,
          pickup_location: request.pickupLocation,
          return_location: request.returnLocation,
          base_price: basePrice,
          insurance_fee: insuranceFee,
          service_fee: serviceFee,
          total_price: totalPrice,
          deposit_amount: depositAmount,
          status: 'pending',
          payment_status: 'preauthorized',
          duration_days: durationDays,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          vehicle:vehicles(*),
          renter:profiles!renter_id(*),
          owner:profiles!owner_id(*)
        `)
        .single();

      if (bookingError) {
        console.error("Erreur lors de la création de la réservation:", bookingError);
        throw bookingError;
      }

      // Créer une notification pour le propriétaire
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: ownerId,
          type: 'booking_request',
          title: 'Nouvelle demande de réservation',
          message: `Vous avez reçu une nouvelle demande de réservation pour votre véhicule ${vehicleData.make} ${vehicleData.model}`,
          related_id: bookingData.id,
          is_read: false
        });

      if (notificationError) {
        console.error("Erreur lors de la création de la notification:", notificationError);
      }

      toast({
        title: "Demande envoyée",
        description: "Votre demande de réservation a bien été envoyée au propriétaire."
      });

      return {
        success: true,
        bookingId: bookingData.id
      };
    } catch (error: any) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de créer la réservation."
      });
      return {
        success: false,
        error: error.message
      };
    }
  }, [user, toast]);
  
  /**
   * Accepter une demande de réservation (pour les propriétaires)
   */
  const acceptBookingRequest = useCallback(async (
    bookingId: string
  ): Promise<BookingActionResponse> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Appel à la fonction RPC pour accepter la réservation
      const { data, error } = await supabase.rpc('accept_booking_request', {
        p_booking_id: bookingId
      });
      
      if (error) throw error;
      
      if (data) {
        // Mise à jour de la réservation locale
        await getBookingById(bookingId);
        
        toast({
          title: "Demande acceptée",
          description: "Vous avez accepté la demande de réservation."
        });
        
        return {
          success: true,
          message: "Réservation acceptée"
        };
      }
      
      throw new Error("La demande n'a pas pu être acceptée");
    } catch (error: any) {
      console.error("Erreur lors de l'acceptation de la réservation:", error.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accepter cette demande de réservation."
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [user, getBookingById, toast]);
  
  /**
   * Refuser une demande de réservation (pour les propriétaires)
   */
  const rejectBookingRequest = useCallback(async (
    bookingId: string,
    reason?: string
  ): Promise<BookingActionResponse> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Appel à la fonction RPC pour refuser la réservation
      const { data, error } = await supabase.rpc('reject_booking_request', {
        p_booking_id: bookingId,
        p_reason: reason
      });
      
      if (error) throw error;
      
      if (data) {
        // Mise à jour de la réservation locale
        await getBookingById(bookingId);
        
        toast({
          title: "Demande refusée",
          description: "Vous avez refusé la demande de réservation."
        });
        
        return {
          success: true,
          message: "Réservation refusée"
        };
      }
      
      throw new Error("La demande n'a pas pu être refusée");
    } catch (error: any) {
      console.error("Erreur lors du refus de la réservation:", error.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de refuser cette demande de réservation."
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [user, getBookingById, toast]);
  
  /**
   * Confirmer le paiement d'une réservation (simulation pour le moment)
   */
  const confirmBookingPayment = useCallback(async (
    bookingId: string
  ): Promise<BookingActionResponse> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Mise à jour de la réservation
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'charged',
          payment_id: `pmt_${Date.now()}`, // Simuler un ID de paiement
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('renter_id', user.id)
        .eq('status', 'accepted');
      
      if (error) throw error;
      
      // Mise à jour de la réservation locale
      await getBookingById(bookingId);
      
      toast({
        title: "Paiement confirmé",
        description: "Votre paiement a été confirmé et la réservation est validée."
      });
      
      return {
        success: true,
        message: "Paiement confirmé"
      };
    } catch (error: any) {
      console.error("Erreur lors de la confirmation du paiement:", error.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de confirmer le paiement de cette réservation."
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [user, getBookingById, toast]);
  
  /**
   * Partager les coordonnées de contact entre le propriétaire et le locataire
   */
  const shareContactDetails = useCallback(async (
    bookingId: string
  ): Promise<BookingActionResponse> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Vérifier que l'utilisateur est bien le propriétaire ou le locataire
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (!booking) {
        throw new Error("Réservation non trouvée");
      }
      
      // Vérifier que la réservation est bien confirmée
      if (booking.status !== 'confirmed') {
        throw new Error("La réservation doit être confirmée pour partager les coordonnées");
      }
      
      // Mettre à jour la réservation
      const { error } = await supabase
        .from('bookings')
        .update({
          contact_shared: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Mise à jour de la réservation locale
      await getBookingById(bookingId);
      
      toast({
        title: "Coordonnées partagées",
        description: "Les coordonnées de contact ont été partagées."
      });
      
      return {
        success: true,
        message: "Coordonnées partagées"
      };
    } catch (error: any) {
      console.error("Erreur lors du partage des coordonnées:", error.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de partager les coordonnées."
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [user, getBookingById, toast]);
  
  /**
   * Enregistrer l'état des lieux lors du retrait du véhicule
   */
  const savePickupChecklist = useCallback(async (
    bookingId: string,
    checklist: VehicleChecklist,
    photos: string[]
  ): Promise<BookingActionResponse> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Mise à jour de la réservation
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'in_progress',
          pickup_checklist: checklist,
          pickup_photos: photos,
          pickup_contract_signed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
        .eq('status', 'confirmed');
      
      if (error) throw error;
      
      // Mise à jour de la réservation locale
      await getBookingById(bookingId);
      
      toast({
        title: "État des lieux enregistré",
        description: "L'état des lieux de départ a été enregistré avec succès."
      });
      
      return {
        success: true,
        message: "État des lieux enregistré"
      };
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de l'état des lieux:", error.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer l'état des lieux."
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [user, getBookingById, toast]);
  
  /**
   * Enregistrer l'état des lieux lors du retour du véhicule
   */
  const saveReturnChecklist = useCallback(async (
    bookingId: string,
    checklist: VehicleChecklist,
    photos: string[]
  ): Promise<BookingActionResponse> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Mise à jour de la réservation
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'completed',
          return_checklist: checklist,
          return_photos: photos,
          return_contract_signed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
        .eq('status', 'in_progress');
      
      if (error) throw error;
      
      // Mise à jour de la réservation locale
      await getBookingById(bookingId);
      
      toast({
        title: "État des lieux enregistré",
        description: "L'état des lieux de retour a été enregistré avec succès."
      });
      
      return {
        success: true,
        message: "État des lieux enregistré"
      };
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de l'état des lieux:", error.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer l'état des lieux."
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [user, getBookingById, toast]);
  
  /**
   * Annuler une réservation (en tant que locataire, uniquement à l'état pending)
   */
  const cancelBooking = useCallback(async (
    bookingId: string
  ): Promise<BookingActionResponse> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Mise à jour de la réservation
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('renter_id', user.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      // Mise à jour de la réservation locale
      await getBookingById(bookingId);
      
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès."
      });
      
      return {
        success: true,
        message: "Réservation annulée"
      };
    } catch (error: any) {
      console.error("Erreur lors de l'annulation de la réservation:", error.message);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler cette réservation."
      });
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [user, getBookingById, toast]);
  
  return {
    loading,
    booking,
    bookings,
    getBookingById,
    getOwnerBookings,
    getUserBookings,
    createBookingRequest,
    acceptBookingRequest,
    rejectBookingRequest,
    confirmBookingPayment,
    shareContactDetails,
    savePickupChecklist,
    saveReturnChecklist,
    cancelBooking
  };
}; 