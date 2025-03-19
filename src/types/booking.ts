import { UserProfile } from './user';
import { Vehicle } from './vehicle';

export type BookingStatus = 
  | 'pending'      // En attente de confirmation
  | 'confirmed'    // Confirmée par le propriétaire
  | 'in_progress'  // Location en cours
  | 'completed'    // Location terminée
  | 'cancelled'    // Annulée par le locataire
  | 'rejected'     // Rejetée par le propriétaire
  | 'expired';     // Expirée (non confirmée dans les délais)

export const BookingStatusLabels: Record<BookingStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
  rejected: 'Rejetée',
  expired: 'Expirée'
};

export const BookingStatusColors: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800'
};

export type PaymentStatus = 
  | 'preauthorized' // Carte enregistrée, montant préautorisé
  | 'charged'       // Paiement effectué
  | 'refunded'      // Remboursé
  | 'failed'        // Échec du paiement
  | 'partial_refund'; // Remboursement partiel (dépôt)

export type InsuranceOption = 'basic' | 'standard' | 'premium';

// Type pour les statuts de réservation
export interface Booking {
  id: string;
  
  // Informations sur le véhicule
  vehicleId: string;
  vehicleName: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string | number;
  vehicleImageUrl?: string;
  
  // Informations sur le locataire
  renterId: string;
  renterName: string;
  renterEmail: string;
  renterPhone?: string;
  
  // Informations sur le propriétaire
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  
  // Statut et dates
  status: BookingStatus;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  
  // Informations financières
  dailyRate: number;
  durationDays: number;
  serviceFee: number;
  totalAmount: number;
  depositAmount: number;
  
  // États des lieux
  pickupChecklist?: VehicleChecklist;
  pickupPhotos?: string[];
  pickupDate?: string;
  
  returnChecklist?: VehicleChecklist;
  returnPhotos?: string[];
  returnDate?: string;
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
}

// Type pour l'état des lieux d'un véhicule
export interface VehicleChecklist {
  // État général
  fuelLevel: number; // 0-100%
  odometerReading: number; // en km
  
  // État extérieur
  exterior: {
    body: boolean; // true = OK, false = problème
    paint: boolean;
    windows: boolean;
    lights: boolean;
    tires: boolean;
    // Autres éléments extérieurs
  };
  
  // État intérieur
  interior: {
    seats: boolean;
    dashboard: boolean;
    flooring: boolean;
    controls: boolean;
    // Autres éléments intérieurs
  };
  
  // État mécanique
  mechanical: {
    engine: boolean;
    transmission: boolean;
    brakes: boolean;
    steering: boolean;
    // Autres éléments mécaniques
  };
  
  // Accessoires
  accessories: {
    spareWheel: boolean;
    jackTools: boolean;
    firstAidKit: boolean;
    // Autres accessoires
  };
  
  // Documents
  documents: {
    registration: boolean;
    insurance: boolean;
    maintenanceRecords: boolean;
  };
  
  // Liste des dommages ou problèmes
  damages: DamageItem[];
  
  // Liste des objets manquants
  missing: string[];
  
  // Niveau de propreté (1 à 5)
  cleanlinessRating: number;
  
  // Commentaires généraux
  comments: string;
}

// Type pour un élément de dommage
export interface DamageItem {
  id: string;
  location: string; // ex: "Portière avant gauche"
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  photoUrls?: string[];
}

// Type pour les options de paiement
export interface PaymentOption {
  id: string;
  name: string;
  description: string;
  depositRequired: boolean;
  depositAmount: number;
  processingFee: number;
  isDefault: boolean;
}

export interface BookingRequest {
  vehicleId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  insuranceOption: InsuranceOption;
  paymentMethod?: string; // ID de la méthode de paiement
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  error?: string;
}

export interface BookingActionResponse {
  success: boolean;
  message?: string;
  error?: string;
} 