import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserRole } from '@/types/user';
import { supabase, isAuthenticated, clearAuthSession } from '@/lib/supabase';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { user, getUserRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      try {
        if (!user) {
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        // Récupérer les métadonnées utilisateur (source de vérité initiale)
        const metadataRole = user.user_metadata?.role as UserRole;
        console.log('User metadata role:', metadataRole);

        try {
          // Appeler la fonction RPC pour obtenir/créer le profil
          const { data: profileData, error: profileError } = await supabase
            .rpc('get_or_create_profile');

          if (profileError) {
            console.error('Error from get_or_create_profile in RoleRoute:', profileError);
            throw profileError;
          }

          // Vérifier si des données valides ont été renvoyées
          if (profileData && profileData.length > 0 && profileData[0].id) {
            const profile = profileData[0];
            const profileRole = profile.role as UserRole;
            
            console.log('Profile retrieved in RoleRoute:', profile);
            console.log('Checking if role', profileRole, 'is in allowed roles:', allowedRoles);

            // Si le rôle du profil est dans les rôles autorisés, accorder l'accès
            if (profileRole && allowedRoles.includes(profileRole)) {
              if (isMounted) {
                setHasAccess(true);
                setIsLoading(false);
              }
              return;
            }
            
            // Si les rôles ne correspondent pas mais que le rôle des métadonnées est autorisé
            if (metadataRole && allowedRoles.includes(metadataRole) && 
                (!profileRole || profileRole !== metadataRole)) {
              
              console.log('Role mismatch: profile=', profileRole, 'metadata=', metadataRole);
              console.log('Updating profile role to match metadata role');
              
              // Mettre à jour le profil avec le rôle des métadonnées (prioritaire)
              try {
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ role: metadataRole, updated_at: new Date().toISOString() })
                  .eq('id', user.id);
                
                if (updateError) {
                  console.error('Error updating profile role in RoleRoute:', updateError);
                } else {
                  console.log('Profile role successfully updated to match metadata');
                }
                
                // Accorder l'accès puisque le rôle des métadonnées est autorisé
                if (isMounted) {
                  setHasAccess(true);
                  setIsLoading(false);
                }
                return;
              } catch (updateErr) {
                console.error('Exception updating profile role in RoleRoute:', updateErr);
              }
            }
          } else {
            console.warn('No valid profile data returned from RPC');
            
            // Si aucun profil n'a été trouvé, vérifier les métadonnées
            if (metadataRole && allowedRoles.includes(metadataRole)) {
              console.log('No profile found but metadata role is allowed');
              
              // Créer un profil manuellement via l'API
              try {
                // Récupérer des données utilisateur supplémentaires si nécessaire
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) {
                  console.error('Erreur lors de la récupération des données utilisateur:', userError);
                  // Continuer quand même
                }
                
                const userMetadata = userData?.user?.user_metadata || user.user_metadata || {};
                
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: user.id,
                    email: user.email,
                    first_name: userMetadata.firstName || userMetadata.first_name || '',
                    last_name: userMetadata.lastName || userMetadata.last_name || '',
                    role: metadataRole,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    notification_preferences: { email: true, push: true }
                  });
                
                if (insertError) {
                  console.error('Erreur création profil manuellement:', insertError);
                } else {
                  console.log('Profil créé manuellement avec succès');
                }
                
                // Malgré l'erreur éventuelle, accorder l'accès si le rôle est autorisé
                if (isMounted) {
                  setHasAccess(true);
                  setIsLoading(false);
                }
                return;
              } catch (insertErr) {
                console.error('Exception création profil manuelle:', insertErr);
              }
            }
          }

          // Si on arrive ici, l'utilisateur n'a pas accès
          console.log('User does not have access to this route');
          if (isMounted) {
            // Déterminer le chemin de redirection en fonction du rôle
            const userRole = await getUserRole();
            const path = userRole === 'owner' ? '/dashboard/owner' : '/dashboard/renter';
            
            setHasAccess(false);
            setRedirectPath(path);
            setIsLoading(false);
            
            toast.error(
              `Accès non autorisé. Redirection vers votre tableau de bord ${
                userRole === 'owner' ? 'propriétaire' : 'locataire'
              }`
            );
          }
        } catch (error) {
          console.error('Error in profile processing:', error);
          if (isMounted) {
            setHasAccess(false);
            setIsLoading(false);
            // En cas d'erreur, rediriger vers le tableau de bord locataire par défaut
            setRedirectPath('/dashboard/renter');
          }
        }
      } catch (error) {
        console.error('Critical error in checkAccess:', error);
        if (isMounted) {
          toast.error("Une erreur est survenue lors de la vérification de vos accès");
          setIsLoading(false);
          // En cas d'erreur critique, rediriger vers le tableau de bord locataire par défaut
          setRedirectPath('/dashboard/renter');
        }
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [user?.id, allowedRoles.join(), getUserRole]);

  // Fonction pour réparer un profil utilisateur avec des problèmes
  const repairUserProfile = async (userId: string, role: UserRole) => {
    try {
      console.log("Tentative de réparation du profil utilisateur:", userId, role);
      
      if (!userId) {
        console.error("ID utilisateur manquant pour la réparation du profil");
        return false;
      }
      
      // Vérification si le profil existe déjà
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification du profil:", checkError);
      }
      
      if (existingProfile) {
        // Le profil existe, mettons à jour le rôle
        console.log("Profil existant trouvé, mise à jour du rôle:", role);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: role,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error("Erreur lors de la mise à jour du profil:", updateError);
          return false;
        }
        
        console.log("Profil mis à jour avec succès");
        return true;
      } else {
        // Le profil n'existe pas, créons-le sans utiliser les RPC
        console.log("Aucun profil trouvé, création d'un nouveau profil avec le rôle:", role);
        
        // Obtenir les données utilisateur pour l'email
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error("Erreur lors de la récupération des données utilisateur:", userError);
          return false;
        }
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userData.user.email,
            first_name: userData.user.user_metadata?.firstName || '',
            last_name: userData.user.user_metadata?.lastName || '',
            role: role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notification_preferences: { email: true, push: true }
          });
          
        if (insertError) {
          console.error("Erreur lors de la création du profil:", insertError);
          return false;
        }
        
        console.log("Nouveau profil créé avec succès");
        return true;
      }
    } catch (error) {
      console.error("Erreur lors de la réparation du profil:", error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!hasAccess && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute; 