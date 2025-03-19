import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/hooks/use-booking';
import { Booking, BookingStatus } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatDate } from '@/lib/utils';
import { 
  Car, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  CreditCard
} from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const BookingsList = () => {
  const { user } = useAuth();
  const { getUserBookings, loading, bookings } = useBooking();
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'renter' | 'owner'>('renter');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      console.log("BookingsList: Début de la récupération des réservations");
      console.log(`BookingsList: Utilisateur ${user.id}, rôle sélectionné: ${selectedRole}`);
      
      try {
        const bookings = await getUserBookings(selectedRole);
        console.log(`BookingsList: ${bookings.length} réservations récupérées en tant que ${selectedRole}`);
      } catch (error) {
        console.error("BookingsList: Erreur lors de la récupération des réservations:", error);
      }
    };

    fetchBookings();
  }, [getUserBookings, selectedRole, user]);

  const getFilteredBookings = () => {
    console.log(`BookingsList: Filtrage des réservations (${bookings.length}) avec le filtre: ${activeTab}`);
    if (activeTab === 'all') return bookings;
    
    if (activeTab === 'pending') {
      return bookings.filter(b => b.status === 'pending');
    }
    
    if (activeTab === 'active') {
      return bookings.filter(b => ['confirmed', 'in_progress'].includes(b.status));
    }
    
    if (activeTab === 'completed') {
      return bookings.filter(b => ['completed', 'cancelled', 'declined'].includes(b.status));
    }
    
    return bookings;
  };

  // Calculer les réservations filtrées
  const filteredBookings = getFilteredBookings();
  console.log("Réservations filtrées:", filteredBookings);
  console.log("État de chargement:", loading);

  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
      pending: { variant: 'secondary', label: 'En attente' },
      confirmed: { variant: 'default', label: 'Confirmée' },
      in_progress: { variant: 'success', label: 'En cours' },
      completed: { variant: 'success', label: 'Terminée' },
      cancelled: { variant: 'destructive', label: 'Annulée' },
      declined: { variant: 'destructive', label: 'Refusée' },
      disputed: { variant: 'destructive', label: 'Litige' }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    
    return (
      <Badge variant={config.variant as any}>{config.label}</Badge>
    );
  };

  const handleViewBooking = (bookingId: string) => {
    navigate(`/bookings/${bookingId}`);
  };

  const renderBookingCard = (booking: Booking) => {
    console.log("Rendu de la carte de réservation:", booking);
    // Déterminer si l'utilisateur est le propriétaire ou le locataire
    const isOwner = user?.id === booking.ownerId;
    
    return (
      <Card key={booking.id} className="hover:shadow-md transition-shadow overflow-hidden">
        {/* Image du véhicule en haut de la carte */}
        {booking.vehicleImageUrl && (
          <div className="relative h-40 w-full">
            <img 
              src={booking.vehicleImageUrl} 
              alt={booking.vehicleName} 
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              {getStatusBadge(booking.status)}
            </div>
          </div>
        )}
        
        <CardHeader className={booking.vehicleImageUrl ? "" : "pb-2"}>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              {booking.vehicleName || `${booking.vehicleBrand} ${booking.vehicleModel} ${booking.vehicleYear}`}
            </CardTitle>
            {!booking.vehicleImageUrl && (
              <div>{getStatusBadge(booking.status)}</div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-0">
          {/* Période de location */}
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Période de location</p>
              <p className="text-sm text-muted-foreground">
                Du {formatDate(booking.startDate)} au {formatDate(booking.endDate)}
                {booking.durationDays && ` (${booking.durationDays} jours)`}
              </p>
            </div>
          </div>
          
          {/* Lieu */}
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Lieu de prise en charge</p>
              <p className="text-sm text-muted-foreground">{booking.pickupLocation}</p>
            </div>
          </div>
          
          {/* Locataire ou Propriétaire */}
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{isOwner ? 'Locataire' : 'Propriétaire'}</p>
              <p className="text-sm text-muted-foreground">
                {isOwner ? booking.renterName : booking.ownerName}
              </p>
            </div>
          </div>
          
          {/* Prix */}
          <div className="flex items-start gap-3">
            <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Tarif</p>
              <p className="text-sm text-muted-foreground">
                {booking.dailyRate?.toLocaleString('fr-FR')} MAD/jour · 
                Total: {booking.totalAmount?.toLocaleString('fr-FR')} MAD
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => handleViewBooking(booking.id)}
          >
            Voir les détails
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderSkeletons = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-40 w-full">
            <Skeleton className="h-full w-full" />
          </div>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-start gap-3">
                <Skeleton className="h-4 w-4 mt-0.5" />
                <div className="space-y-1.5 w-full">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
            <Skeleton className="h-9 w-full mt-2" />
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {selectedRole === 'owner' ? 'Réservations de mes véhicules' : 'Mes réservations'}
          </h1>
          <p className="text-gray-600">
            {selectedRole === 'owner' 
              ? 'Gérez les demandes de réservation pour vos véhicules' 
              : 'Consultez les véhicules que vous avez réservés'}
          </p>
        </div>
        
        {/* Sélecteur de rôle */}
        <div className="mt-4 md:mt-0">
          <Select
            value={selectedRole}
            onValueChange={(value: 'renter' | 'owner') => setSelectedRole(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="renter">Mes locations</SelectItem>
              <SelectItem value="owner">Mes véhicules loués</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">
            {selectedRole === 'owner' ? 'Demandes de réservation' : 'Véhicules réservés'}
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all" className="text-xs md:text-sm">
                Toutes
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs md:text-sm">
                <Clock className="h-3 w-3 md:h-4 md:w-4 md:mr-1 hidden md:inline" />
                En attente
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs md:text-sm">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 md:mr-1 hidden md:inline" />
                Actives
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs md:text-sm">
                <XCircle className="h-3 w-3 md:h-4 md:w-4 md:mr-1 hidden md:inline" />
                Terminées
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            renderSkeletons()
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map(booking => renderBookingCard(booking))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Aucune réservation trouvée</h3>
                <p className="text-muted-foreground text-center mt-1">
                  {selectedRole === 'owner' 
                    ? `Vous n'avez pas encore reçu de demandes de réservation pour vos véhicules${activeTab !== 'all' ? ' dans cette catégorie' : ''}.`
                    : `Vous n'avez pas encore réservé de véhicules${activeTab !== 'all' ? ' dans cette catégorie' : ''}.`}
                </p>
                {selectedRole === 'owner' && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/dashboard/owner/vehicles')}
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Gérer mes véhicules
                  </Button>
                )}
                {selectedRole === 'renter' && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/')}
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Rechercher des véhicules
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsList; 