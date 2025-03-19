import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Booking, 
  BookingStatus,
  PaymentStatus
} from '@/types';
import { useBooking } from '@/hooks/use-booking';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Car, 
  Shield, 
  Info,
  Camera,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Ban
} from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface BookingDetailsProps {
  booking: Booking;
  userRole: 'renter' | 'owner';
  onAction?: (action: string) => void;
}

export const BookingDetails = ({ booking, userRole, onAction }: BookingDetailsProps) => {
  const { loading, shareContactDetails, confirmBookingPayment, cancelBooking } = useBooking();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();
  
  // Formater les dates
  const formattedStartDate = format(new Date(booking.startDate), 'PPP', { locale: fr });
  const formattedEndDate = format(new Date(booking.endDate), 'PPP', { locale: fr });
  
  // Durée totale en jours
  const durationDays = differenceInDays(new Date(booking.endDate), new Date(booking.startDate)) + 1;
  
  // Détermine la couleur du badge en fonction du statut
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'accepted':
        return <Badge variant="info">Acceptée</Badge>;
      case 'confirmed':
        return <Badge variant="success">Confirmée</Badge>;
      case 'in_progress':
        return <Badge variant="purple">En cours</Badge>;
      case 'completed':
        return <Badge variant="success">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusée</Badge>;
      case 'disputed':
        return <Badge variant="destructive">Litige</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Détermine la couleur du badge pour le statut de paiement
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'preauthorized':
        return <Badge variant="warning">Préautorisé</Badge>;
      case 'charged':
        return <Badge variant="success">Payé</Badge>;
      case 'refunded':
        return <Badge variant="info">Remboursé</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
      case 'partial_refund':
        return <Badge variant="info">Remboursement partiel</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Traduction des statuts pour affichage
  const getStatusText = (status: BookingStatus) => {
    const statusMap: Record<BookingStatus, string> = {
      'pending': 'En attente de confirmation',
      'accepted': 'Demande acceptée, en attente de paiement',
      'confirmed': 'Réservation confirmée',
      'in_progress': 'Location en cours',
      'completed': 'Location terminée',
      'cancelled': 'Réservation annulée',
      'rejected': 'Demande refusée',
      'disputed': 'Litige en cours'
    };
    
    return statusMap[status] || status;
  };
  
  // Actions possibles en fonction du statut et du rôle
  const getPrimaryAction = () => {
    if (userRole === 'renter') {
      if (booking.status === 'accepted') {
        return {
          label: 'Confirmer et payer',
          action: 'confirm_payment',
          disabled: loading
        };
      } else if (booking.status === 'confirmed' && !booking.contactShared) {
        return {
          label: 'Partager mes coordonnées',
          action: 'share_contact',
          disabled: loading
        };
      } else if (booking.status === 'confirmed' && booking.contactShared) {
        return {
          label: 'Retrait du véhicule',
          action: 'vehicle_pickup',
          disabled: false
        };
      } else if (booking.status === 'in_progress') {
        return {
          label: 'Retour du véhicule',
          action: 'vehicle_return',
          disabled: false
        };
      }
    } else if (userRole === 'owner') {
      if (booking.status === 'confirmed' && !booking.contactShared) {
        return {
          label: 'Partager mes coordonnées',
          action: 'share_contact',
          disabled: loading
        };
      } else if (booking.status === 'confirmed' && booking.contactShared) {
        return {
          label: 'Retrait du véhicule',
          action: 'vehicle_pickup',
          disabled: false
        };
      } else if (booking.status === 'in_progress') {
        return {
          label: 'Retour du véhicule',
          action: 'vehicle_return',
          disabled: false
        };
      }
    }
    
    return null;
  };
  
  // Gestion des actions
  const handleAction = async (action: string) => {
    switch (action) {
      case 'confirm_payment':
        await confirmBookingPayment(booking.id);
        break;
      case 'share_contact':
        await shareContactDetails(booking.id);
        break;
      case 'vehicle_pickup':
      case 'vehicle_return':
        if (onAction) {
          onAction(action);
        }
        break;
    }
  };
  
  // Déterminer la personne avec qui l'utilisateur interagit
  const counterpart = userRole === 'renter' ? booking.owner : booking.renter;
  
  // Déterminer les actions disponibles selon le statut et le rôle
  const renderActions = () => {
    if (userRole === 'renter') {
      switch (booking.status) {
        case 'pending':
          return (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowCancelDialog(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Annuler la demande
            </Button>
          );
        case 'confirmed':
          return (
            <Button 
              className="w-full"
              onClick={() => onAction?.('vehicle_pickup')}
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              État des lieux - Prise du véhicule
            </Button>
          );
        case 'in_progress':
          return (
            <Button 
              className="w-full"
              onClick={() => onAction?.('vehicle_return')}
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              État des lieux - Retour du véhicule
            </Button>
          );
        case 'completed':
          return (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onAction?.('view_pickup_checklist')}
              >
                Voir état initial
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onAction?.('view_return_checklist')}
              >
                Voir état final
              </Button>
            </div>
          );
        default:
          return null;
      }
    } else { // Owner
      switch (booking.status) {
        case 'confirmed':
          return (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCancelDialog(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              {booking.pickupChecklist && (
                <Button 
                  className="flex-1"
                  onClick={() => onAction?.('start_rental')}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Débuter la location
                </Button>
              )}
            </div>
          );
        case 'in_progress':
          return booking.returnChecklist && (
            <Button 
              className="w-full"
              onClick={() => onAction?.('complete_rental')}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Terminer la location
            </Button>
          );
        case 'completed':
          return (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onAction?.('view_pickup_checklist')}
              >
                Voir état initial
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onAction?.('view_return_checklist')}
              >
                Voir état final
              </Button>
            </div>
          );
        default:
          return null;
      }
    }
  };
  
  // État des lieux effectués
  const renderChecklistStatus = () => {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">État des lieux initial:</span>
          {booking.pickupChecklist ? (
            <Badge variant="success" className="flex items-center">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Complété
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center">
              <AlertCircle className="mr-1 h-3 w-3" />
              Non effectué
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">État des lieux final:</span>
          {booking.returnChecklist ? (
            <Badge variant="success" className="flex items-center">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Complété
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center">
              <AlertCircle className="mr-1 h-3 w-3" />
              Non effectué
            </Badge>
          )}
        </div>
      </div>
    );
  };
  
  // Coordonnées de l'autre partie
  const renderContactInfo = () => {
    // N'afficher les coordonnées que si la réservation est confirmée ou en cours
    if (!['confirmed', 'in_progress', 'completed'].includes(booking.status)) {
      return null;
    }

    const contactName = userRole === 'renter' ? booking.ownerName : booking.renterName;
    const contactEmail = userRole === 'renter' ? booking.ownerEmail : booking.renterEmail;
    const contactPhone = userRole === 'renter' ? booking.ownerPhone : booking.renterPhone;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Coordonnées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{contactName || 'Non renseigné'}</span>
          </div>
          {contactEmail && (
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
              <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                {contactEmail}
              </a>
            </div>
          )}
          {contactPhone && (
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
              <a href={`tel:${contactPhone}`} className="text-primary hover:underline">
                {contactPhone}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  const handleCancel = async () => {
    try {
      await cancelBooking(booking.id);
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès.",
      });
      setShowCancelDialog(false);
      if (onAction) {
        onAction('cancel');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails de la réservation</CardTitle>
          {getStatusBadge(booking.status)}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Détails du véhicule */}
          <div className="flex items-start gap-4">
            <div className="bg-muted rounded-md p-2">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{booking.vehicleName}</h3>
              <p className="text-sm text-muted-foreground">
                {booking.vehicleBrand} {booking.vehicleModel} • {booking.vehicleYear}
              </p>
            </div>
          </div>

          <Separator />

          {/* Dates et tarifs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Période de location</span>
              </div>
              <p>Du {formatDate(booking.startDate)} au {formatDate(booking.endDate)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Lieu de prise en charge</span>
              </div>
              <p>{booking.pickupLocation}</p>
            </div>
          </div>

          <Separator />

          {/* Résumé des tarifs */}
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Tarifs</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span>Prix journalier:</span>
              <span className="text-right">{formatPrice(Number(booking.dailyRate))}</span>
              
              <span>Nombre de jours:</span>
              <span className="text-right">{booking.durationDays} jours</span>
              
              <span>Sous-total:</span>
              <span className="text-right">{formatPrice(Number(booking.dailyRate) * Number(booking.durationDays))}</span>
              
              {booking.serviceFee > 0 && (
                <>
                  <span>Frais de service:</span>
                  <span className="text-right">{formatPrice(Number(booking.serviceFee))}</span>
                </>
              )}
              
              <span className="font-semibold pt-2">Total:</span>
              <span className="text-right font-semibold pt-2">{formatPrice(Number(booking.totalAmount))}</span>
              
              <span className="text-xs text-muted-foreground pt-2">Dépôt de garantie:</span>
              <span className="text-right text-xs text-muted-foreground pt-2">{formatPrice(Number(booking.depositAmount))}</span>
            </div>
          </div>

          {/* État de la checklist si applicable */}
          {['confirmed', 'in_progress', 'completed'].includes(booking.status) && renderChecklistStatus()}
        </CardContent>
        <CardFooter>
          {renderActions()}
        </CardFooter>
      </Card>

      {/* Informations de contact */}
      {renderContactInfo()}

      {/* Dialog de confirmation d'annulation */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'annulation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? "Annulation..." : "Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 