
import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { UserRole, DocumentType, UserDocument } from '@/types/user'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  getUserRole: () => Promise<UserRole | null>
  updateUserRole: (role: UserRole) => Promise<void>
  hasRequiredDocuments: (role: UserRole) => Promise<boolean>
  getUserDocuments: () => Promise<UserDocument[]>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const getUserRole = async (): Promise<UserRole | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      if (user.user_metadata?.role) {
        return user.user_metadata.role as UserRole;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return profile?.role as UserRole || null;
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle:", error)
      return null
    }
  }

  const updateUserRole = async (role: UserRole): Promise<void> => {
    try {
      if (!user) throw new Error("Utilisateur non connecté")

      // Update the role in the profile table
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Rôle mis à jour",
        description: `Vous êtes maintenant un ${role === 'owner' ? 'propriétaire' : 'locataire'}.`,
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre rôle.",
      })
      throw error
    }
  }

  const getUserDocuments = async (): Promise<UserDocument[]> => {
    try {
      if (!user) return []

      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error)
      return []
    }
  }

  const hasRequiredDocuments = async (role: UserRole): Promise<boolean> => {
    try {
      if (!user) return false

      const documents = await getUserDocuments()
      
      // Define required documents for each role
      const requiredDocuments: DocumentType[] = role === 'renter' 
        ? ['driver_license', 'identity_card'] 
        : ['identity_card', 'bank_details', 'vehicle_registration', 'insurance']

      // Check if all required documents are verified
      return requiredDocuments.every(docType => 
        documents.some(doc => doc.document_type === docType && doc.status === 'verified')
      )
    } catch (error) {
      console.error("Erreur lors de la vérification des documents:", error)
      return false
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
          },
        },
      })

      if (error) {
        let errorMessage = "Une erreur est survenue lors de l'inscription"
        
        if (error.message.includes('Email already registered')) {
          errorMessage = "Cette adresse email est déjà utilisée"
        } else if (error.message.includes('Password')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères"
        }
        
        toast({
          variant: "destructive",
          title: "Erreur lors de l'inscription",
          description: errorMessage,
        })
        throw error
      }

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: "Un email de confirmation vous a été envoyé.",
        })
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        let errorMessage = "Une erreur est survenue lors de la connexion"
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect"
        }
        
        toast({
          variant: "destructive",
          title: "Erreur lors de la connexion",
          description: errorMessage,
        })
        throw error
      }

      if (data.user) {
        const role = await getUserRole();
        if (!role) {
          toast({
            variant: "default",
            title: "Configuration requise",
            description: "Veuillez configurer votre profil pour continuer",
          });
        } else {
          toast({
            title: "Connexion réussie",
            description: `Bienvenue sur Rakeb ${data.user.user_metadata?.first_name}!`,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      toast({
        variant: "destructive",
        title: "Erreur lors de la connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur lors de la déconnexion",
          description: error.message,
        })
        throw error
      }
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur Rakeb !",
      })
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      toast({
        variant: "destructive",
        title: "Erreur lors de la déconnexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
      throw error
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getUserRole,
    updateUserRole,
    hasRequiredDocuments,
    getUserDocuments,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
