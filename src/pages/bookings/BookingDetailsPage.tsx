import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { BookingDetails } from "@/components/booking/BookingDetails";
import { Booking } from "@/types";

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'renter' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!user || !id) return;

      try {
        setIsLoading(true);

        // Récupérer les détails de la réservation
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

        // Vérifier que l'utilisateur est autorisé à voir cette réservation
        if (data.renter_id !== user.id && data.owner_id !== user.id) {
          toast({
            title: "Accès refusé",
            description: "Vous n'êtes pas autorisé à voir cette réservation.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        // Déterminer le rôle de l'utilisateur
        const role = data.renter_id === user.id ? 'renter' : 'owner';
        setUserRole(role);

        // Formater la réservation
        const formattedBooking: Booking = {
          id: data.id,
          vehicleId: data.vehicle_id,
          vehicleName: data.vehicle ? `${data.vehicle.make} ${data.vehicle.model}` : "Véhicule inconnu",
          vehicleBrand: data.vehicle?.make || '',
          vehicleModel: data.vehicle?.model || '',
          vehicleYear: data.vehicle?.year || '',
          vehicleImageUrl: data.vehicle?.images?.[0] || '',
          
          renterId: data.renter_id,
          renterName: data.renter ? `${data.renter.first_name} ${data.renter.last_name}` : "Locataire inconnu",
          renterEmail: data.renter?.email || '',
          renterPhone: data.renter?.phone || '',
          
          ownerId: data.owner_id,
          ownerName: data.owner ? `${data.owner.first_name} ${data.owner.last_name}` : "Propriétaire inconnu",
          ownerEmail: data.owner?.email || '',
          ownerPhone: data.owner?.phone || '',
          
          startDate: data.start_date,
          endDate: data.end_date,
          pickupLocation: data.pickup_location || '',
          returnLocation: data.return_location || '',
          
          status: data.status,
          
          dailyRate: data.base_price / (data.duration_days || 1),
          durationDays: data.duration_days || 1,
          serviceFee: data.service_fee || 0,
          totalAmount: data.total_price || 0,
          depositAmount: data.deposit_amount || 0,
          
          pickupChecklist: data.pickup_checklist,
          pickupPhotos: data.pickup_photos || [],
          returnChecklist: data.return_checklist,
          returnPhotos: data.return_photos || [],
          
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          contactShared: data.contact_shared || false
        };

        setBooking(formattedBooking);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la réservation:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les détails de la réservation.",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, user, navigate, toast]);

  const handleBookingAction = async (action: string) => {
    if (!booking || !user) return;

    try {
      if (action === 'cancel') {
        // Vérifier que l'utilisateur est autorisé à annuler
        if (userRole === 'renter' && booking.renterId !== user.id) {
          throw new Error("Vous n'êtes pas autorisé à annuler cette réservation.");
        }

        // Annuler la réservation
        const { error } = await supabase
          .from('bookings')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', booking.id);

        if (error) throw error;

        // Mettre à jour l'état local
        setBooking({
          ...booking,
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        });

        toast({
          title: "Réservation annulée",
          description: "La réservation a été annulée avec succès."
        });
      } else if (action === 'share_contact') {
        // Partager les coordonnées
        const { error } = await supabase
          .from('bookings')
          .update({ 
            contact_shared: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', booking.id);

        if (error) throw error;

        // Mettre à jour l'état local
        setBooking({
          ...booking,
          contactShared: true,
          updatedAt: new Date().toISOString()
        });

        toast({
          title: "Coordonnées partagées",
          description: "Vos coordonnées ont été partagées avec succès."
        });
      } else if (action === 'vehicle_pickup' || action === 'vehicle_return') {
        // Rediriger vers la page d'état des lieux
        navigate(`/bookings/${booking.id}/${action}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error);
      toast({
        title: "Erreur",
        description: error.message || `Impossible d'effectuer l'action demandée.`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des détails de la réservation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Réservation introuvable</h1>
            <p className="text-gray-600 mb-6">La réservation que vous recherchez n'existe pas ou a été supprimée.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:underline flex items-center"
          >
            ← Retour au tableau de bord
          </button>
          <h1 className="text-2xl font-bold mt-2">Détails de la réservation</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <BookingDetails 
            booking={booking} 
            userRole={userRole} 
            onAction={handleBookingAction} 
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage; 