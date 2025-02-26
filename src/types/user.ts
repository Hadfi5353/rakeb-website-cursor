
export type UserRole = 'owner' | 'renter';
export type DocumentType = 'driver_license' | 'identity_card' | 'passport' | 'bank_details' | 'selfie_with_id' | 'proof_of_address' | 'vehicle_registration' | 'insurance';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type DocumentStatus = 'pending' | 'verified' | 'rejected';

export interface Address {
  street: string;
  city: string;
  zip_code: string;
  country: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface BankInformation {
  iban: string;
  bic: string;
  accountHolder: string;
}

export interface UserStats {
  total_rentals: number;
  rating: number;
  rating_count: number;
  reservation_compliance: number;
  acceptance_rate: number;
}

export interface UserDocument {
  id: string;
  user_id: string;
  document_type: DocumentType;
  file_url: string;
  status: DocumentStatus;
  verification_date?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  birthdate?: string;
  address?: Address;
  phone_verified: boolean;
  email_verified: boolean;
  verification_status: VerificationStatus;
  preferred_language: string;
  notification_preferences: NotificationPreferences;
  bank_information?: BankInformation;
  profile_completion: number;
  stats: UserStats;
  created_at: string;
  updated_at: string;
}
