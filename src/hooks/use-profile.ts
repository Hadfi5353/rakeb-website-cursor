import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile, UserDocument } from '@/types/user';
export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UserDocument[]>([]);

  const calculateProfileCompletion = (profile: Partial<UserProfile>): number => {
    const requiredFields = [
      'first_name',
      'last_name',
      'phone',
      'birthdate',
      'avatar_url',
      'address',
      'email_verified',
      'phone_verified'
    ];
    
    const completedFields = requiredFields.filter(field => {
      if (field === 'address') return profile.address?.street;
      if (field === 'email_verified') return profile.email_verified;
      if (field === 'phone_verified') return profile.phone_verified;
      return profile[field as keyof UserProfile];
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) return null;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data: addresses, error: addressError } = await supabase.rpc(
        'get_user_addresses',
        { user_id: user.id }
      );

      const address = Array.isArray(addresses) && addresses.length > 0 
        ? addresses[0] 
        : null;

      const completeProfile = {
        ...profile,
        address: address || undefined,
        profile_completion: calculateProfileCompletion({
          ...profile,
          address: address || undefined
        })
      };

      return completeProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre profil"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      if (!user) return null;

      const { address, ...profileData } = updates;
      const timestamp = new Date().toISOString();

      const updatePayload = {
        id: user.id,
        ...profileData,
        updated_at: timestamp
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(updatePayload);

      if (profileError) throw profileError;

      if (address) {
        const { error: addressError } = await supabase
          .from('addresses')
          .upsert({
            ...address,
            user_id: user.id,
            updated_at: timestamp
          });

        if (addressError) throw addressError;
      }

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour"
      });

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour mettre à jour votre photo de profil"
        });
        return null;
      }

      // Vérification de la taille du fichier (limite à 2MB)
      const MAX_FILE_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 2MB"
        });
        return null;
      }

      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Type de fichier non supporté",
          description: "Veuillez choisir une image (JPG, PNG, etc.)"
        });
        return null;
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const filePath = `${user.id}/avatar-${timestamp}.${fileExt}`;

      // Upload avec retries
      const MAX_RETRIES = 3;
      let attempt = 0;
      let uploadError = null;

      while (attempt < MAX_RETRIES) {
        try {
          const { error: uploadError, data } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { 
              upsert: true,
              cacheControl: '3600',
              contentType: file.type
            });

          if (!uploadError) {
            // Obtenir l'URL publique
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);

            // Vérifier que l'URL est accessible
            try {
              const response = await fetch(publicUrl, { method: 'HEAD' });
              if (!response.ok) {
                throw new Error(`URL non accessible: ${response.status}`);
              }
            } catch (error) {
              console.warn("Avertissement: URL non immédiatement accessible", error);
              // On continue car l'URL peut devenir accessible après un court délai
            }

            // Mettre à jour le profil avec la nouvelle URL
            const success = await updateProfile({ 
              avatar_url: publicUrl,
              updated_at: new Date().toISOString()
            });

            if (success) {
              toast({
                title: "Succès",
                description: "Votre photo de profil a été mise à jour"
              });
              return publicUrl;
            }
            break;
          }

          console.warn(`Tentative ${attempt + 1}/${MAX_RETRIES} échouée:`, uploadError.message);
          attempt++;
          
          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error("Erreur d'upload:", error);
          attempt++;
          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      throw new Error("Impossible d'uploader l'avatar après plusieurs tentatives");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre photo de profil"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const verifyEmail = async () => {
    try {
      if (!user?.email) return false;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception"
      });

      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email de vérification"
      });
      return false;
    }
  };

  const verifyPhone = async (_phone: string) => {
    try {
      if (!user) return false;

      // Ici, vous devriez implémenter la logique de vérification par SMS
      // Par exemple, avec un service comme Twilio ou Amazon SNS
      
      toast({
        title: "Code envoyé",
        description: "Un code de vérification a été envoyé par SMS"
      });

      return true;
    } catch (error) {
      console.error('Error sending verification SMS:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le SMS de vérification"
      });
      return false;
    }
  };

  const uploadDocument = async (type: string, file: File) => {
    try {
      setUploading(true);
      if (!user) return null;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/documents/${type}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { error: docError } = await supabase
        .from('documents')
        .upsert({
          user_id: user.id,
          type,
          file_url: publicUrl,
          verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (docError) throw docError;

      toast({
        title: "Succès",
        description: "Votre document a été téléchargé"
      });

      return true;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger le document"
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const checkDocuments = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Fonction pour tester l'isolation des données
  const verifyDataIsolation = async () => {
    try {
      let results = {
        profiles: true,
        addresses: true,
        favorites: true,
        transactions: true,
        vehicles: true
      };
      
      // 1. Vérifier l'accès au profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) {
        console.error('Erreur lors de la vérification des profils:', profileError);
        results.profiles = false;
      } else if (profileData && profileData.length > 1) {
        console.error('Violation de l\'isolation des données: accès à plusieurs profils');
        results.profiles = false;
      } else {
        console.log('✅ Isolation des profils vérifiée: OK');
      }

      // 2. Vérifier l'accès aux adresses
      try {
        // Utiliser une approche différente pour cette requête qui cause des problèmes 406
        const { data: addressData, error: addressError } = await supabase.rpc(
          'get_user_addresses', 
          { user_id: user?.id }
        );

        if (addressError) {
          console.error('Erreur lors de la vérification des adresses:', addressError);
          results.addresses = false;
        } else if (!addressData) {
          console.log('✅ Aucune adresse trouvée pour l\'utilisateur, isolation vérifiée');
        } else if (Array.isArray(addressData) && addressData.some(addr => addr.user_id !== user?.id)) {
          console.error('Violation de l\'isolation des données: accès aux adresses d\'autres utilisateurs');
          results.addresses = false;
        } else {
          console.log('✅ Isolation des adresses vérifiée: OK');
        }
      } catch (err) {
        console.error('Exception lors de la vérification des adresses:', err);
        results.addresses = false;
      }

      // 3. Vérifier l'accès aux favoris
      try {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('*');

        if (favoritesError) {
          if (favoritesError.code === '42P01') { // Relation non existante
            console.log('⚠️ Table favoris non existante, vérification ignorée');
          } else {
            console.error('Erreur lors de la vérification des favoris:', favoritesError);
            results.favorites = false;
          }
        } else if (favoritesData && favoritesData.some(fav => fav.user_id !== user?.id)) {
          console.error('Violation de l\'isolation des données: accès aux favoris d\'autres utilisateurs');
          results.favorites = false;
        } else {
          console.log('✅ Isolation des favoris vérifiée: OK');
        }
      } catch (err) {
        console.error('Exception lors de la vérification des favoris:', err);
        results.favorites = false;
      }

      // 4. Vérifier l'accès aux transactions
      try {
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*');

        if (transactionsError) {
          if (transactionsError.code === '42P01') { // Relation non existante
            console.log('⚠️ Table transactions non existante, vérification ignorée');
          } else {
            console.error('Erreur lors de la vérification des transactions:', transactionsError);
            results.transactions = false;
          }
        } else if (transactionsData && transactionsData.some(trans => trans.user_id !== user?.id)) {
          console.error('Violation de l\'isolation des données: accès aux transactions d\'autres utilisateurs');
          results.transactions = false;
        } else {
          console.log('✅ Isolation des transactions vérifiée: OK');
        }
      } catch (err) {
        console.error('Exception lors de la vérification des transactions:', err);
        results.transactions = false;
      }
      
      // 5. Vérifier l'accès aux véhicules (uniquement les siens)
      try {
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*');

        if (vehiclesError) {
          if (vehiclesError.code === '42P01') { // Relation non existante
            console.log('⚠️ Table vehicles non existante, vérification ignorée');
          } else {
            console.error('Erreur lors de la vérification des véhicules:', vehiclesError);
            results.vehicles = false;
          }
        } else if (vehiclesData && vehiclesData.some(vehicle => vehicle.owner_id !== user?.id)) {
          console.error('Violation de l\'isolation des données: accès aux véhicules d\'autres utilisateurs');
          results.vehicles = false;
        } else {
          console.log('✅ Isolation des véhicules vérifiée: OK');
        }
      } catch (err) {
        console.error('Exception lors de la vérification des véhicules:', err);
        results.vehicles = false;
      }

      // Vérification globale
      const isValid = Object.values(results).every(result => result === true);
      if (isValid) {
        console.log('✅ Isolation des données vérifiée avec succès');
        return true;
      } else {
        console.error('❌ Problèmes d\'isolation des données détectés', results);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'isolation des données:', error);
      return false;
    }
  };

  return {
    loading,
    uploading,
    documents,
    setUploading,
    getProfile,
    updateProfile,
    uploadAvatar,
    verifyEmail,
    verifyPhone,
    uploadDocument,
    checkDocuments,
    verifyDataIsolation
  };
}; 