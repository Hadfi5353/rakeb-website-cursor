import { User } from '@supabase/supabase-js';

export type UserRole = 'owner' | 'renter' | 'admin';
export type Language = 'fr' | 'en' | 'ar';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type DocumentType = 'driver_license' | 'identity_card' | 'bank_details' | 'vehicle_registration' | 'insurance';
export type DocumentStatus = 'pending' | 'verified' | 'rejected';

export interface Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
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
  type: DocumentType;
  status: 'pending' | 'approved' | 'rejected';
  url: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  rating?: number;
  total_reviews?: number;
  languages: Language[];
  is_verified: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  birthdate?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialMediaProfile {
  platform: 'linkedin' | 'instagram' | 'facebook';
  url: string;
  verified: boolean;
}

export interface UserReview {
  id: string;
  reviewer_id: string;
  reviewer: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  rating: number;
  comment: string;
  created_at: string;
  rental_id?: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string; role: UserRole }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserRole: () => Promise<UserRole | null>;
  updateUserRole: (role: UserRole) => Promise<void>;
  hasRequiredDocuments: (role: UserRole) => Promise<boolean>;
}
