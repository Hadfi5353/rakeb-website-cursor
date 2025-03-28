import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { UserRole } from '@/types/user'

// Define DocumentType enum/type if not already defined
export type DocumentType = 'driver_license' | 'identity_card' | 'bank_details' | 'vehicle_registration' | 'insurance';

// Update UserDocument interface
interface UserDocument {
  document_type: DocumentType;
  // ... other properties
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { 
    email: string; 
    password: string; 
    options: { 
      data: { 
        first_name: string; 
        last_name: string;
        role: 'owner' | 'renter';
      } 
    } 
  }) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string; phone?: string }) => Promise<void>;
  getUserRole: () => Promise<'owner' | 'renter' | 'admin' | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err instanceof Error ? err.message : 'Failed to get user session');
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: { 
    email: string; 
    password: string; 
    options: { 
      data: { 
        first_name: string; 
        last_name: string;
        role: 'owner' | 'renter';
      } 
    } 
  }) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.options.data.first_name,
            last_name: data.options.data.last_name,
            role: data.options.data.role
          },
        },
      });
      
      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No user data returned from signup');

      // 2. Vérifier si le profil existe déjà
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select()
        .eq('id', authData.user.id)
        .single();

      if (!existingProfile) {
        // 3. Créer le profil seulement s'il n'existe pas
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: authData.user.id,
              email: data.email,
              first_name: data.options.data.first_name,
              last_name: data.options.data.last_name,
              role: data.options.data.role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
          ], {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error('Failed to create user profile');
        }
      }

      return true;
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string; phone?: string }) => {
    if (!user) throw new Error('No user logged in');

    try {
      setError(null);
      setIsLoading(true);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = async (): Promise<'owner' | 'renter' | 'admin' | null> => {
    if (!user) return null;

    console.log("Détermination du rôle pour l'utilisateur:", user.id);

    try {
      // Vérifier d'abord le rôle dans le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData?.role) {
        console.log("Rôle trouvé dans le profil:", profileData.role);
        return profileData.role as 'owner' | 'renter' | 'admin';
      }

      // Si pas de rôle dans le profil, vérifier les autres conditions
      try {
        // Vérifier si l'utilisateur est un administrateur
        const { data: adminData, error: adminQueryError } = await supabase
          .from('admins')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!adminQueryError && adminData) {
          console.log("Utilisateur identifié comme administrateur");
          return 'admin';
        }

        // Vérifier si l'utilisateur est un propriétaire
        const { data: ownerData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);

        if (!vehicleError && ownerData && ownerData.length > 0) {
          console.log("Utilisateur identifié comme propriétaire");
          return 'owner';
        }

        // Par défaut, l'utilisateur est un locataire
        console.log("Aucun rôle spécifique trouvé, attribution du rôle 'renter' par défaut");
        return 'renter';
      } catch (error) {
        console.error('Error checking user roles:', error);
        return 'renter';
      }
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'renter';
    }
  };

  const value = {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
