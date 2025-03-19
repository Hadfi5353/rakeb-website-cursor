import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Car, 
  Calendar, 
  DollarSign, 
  Bell, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle 
} from "lucide-react";
import { BookingRequestsManager } from "@/components/dashboard/BookingRequestsManager";
import { useOwnerBookings } from "@/hooks/use-owner-bookings";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function OwnerBookingsDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { 
    loading, 
    pendingBookings, 
    confirmedBookings, 
    completedBookings, 
    cancelledBookings,
    getOwnerBookings,
    acceptBooking,
    rejectBooking,
    error,
    bookings
  } = useOwnerBookings({
    onError: (error) => {
      console.error("Erreur lors du chargement des réservations:", error);
      toast.error("Impossible de charger vos réservations");
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      console.log("OwnerBookingsDashboard - Chargement des réservations pour l'utilisateur:", user.id);
      console.log("OwnerBookingsDashboard - Rôle de l'utilisateur:", user.user_metadata?.role);
      getOwnerBookings();
    }
  }, [user, getOwnerBookings]);

  useEffect(() => {
    setPendingCount(pendingBookings.length);
  }, [pendingBookings]);

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
        
        handleRefresh();
      })
      .subscribe();

    return () => {
      console.log('Nettoyage de la souscription aux réservations');
      bookingsSubscription.unsubscribe();
    };
  }, [user]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await getOwnerBookings();
      toast.success("Réservations mises à jour");
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des réservations:", error);
      toast.error("Erreur lors du rafraîchissement des réservations");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAcceptBooking = async (booking) => {
    try {
      const success = await acceptBooking(booking.id);
      if (success) {
        await getOwnerBookings();
      }
      return success;
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la réservation:", error);
      toast.error("Erreur lors de l'acceptation de la réservation");
      return false;
    }
  };

  const handleRejectBooking = async (booking, reason) => {
    try {
      const success = await rejectBooking(booking.id, reason);
      if (success) {
        await getOwnerBookings();
      }
      return success;
    } catch (error) {
      console.error("Erreur lors du refus de la réservation:", error);
      toast.error("Erreur lors du refus de la réservation");
      return false;
    }
  };

  const calculateTotalRevenue = () => {
    const confirmedRevenue = confirmedBookings.reduce((total, booking) => total + booking.totalAmount, 0);
    const completedRevenue = completedBookings.reduce((total, booking) => total + booking.totalAmount, 0);
    return confirmedRevenue + completedRevenue;
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord propriétaire</h1>
          <p className="text-muted-foreground">
            Gérez vos véhicules et vos réservations
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Actualiser
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/owner">
              Retour au tableau de bord
            </Link>
          </Button>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="mb-8">
          <Card className="border-yellow-300 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-yellow-800">Demandes en attente</h3>
                  <p className="text-yellow-700">
                    Vous avez {pendingCount} demande{pendingCount > 1 ? 's' : ''} de réservation en attente. 
                    Veuillez les accepter ou les refuser dans les 24 heures.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="ml-auto border-yellow-500 text-yellow-600 hover:bg-yellow-100"
                  onClick={() => document.getElementById('pending-tab')?.click()}
                >
                  Voir les demandes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">En attente</p>
                  <p className="text-2xl font-bold">{pendingBookings.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Confirmées</p>
                  <p className="text-2xl font-bold">{confirmedBookings.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Terminées</p>
                  <p className="text-2xl font-bold">{completedBookings.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Revenus</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "MAD",
                    }).format(calculateTotalRevenue())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BookingRequestsManager
        pendingBookings={pendingBookings}
        confirmedBookings={confirmedBookings}
        completedBookings={completedBookings}
        cancelledBookings={cancelledBookings}
        onAcceptBooking={handleAcceptBooking}
        onRejectBooking={handleRejectBooking}
        loading={loading}
        onRefresh={handleRefresh}
        onCountChange={setPendingCount}
      />
    </div>
  );
} 