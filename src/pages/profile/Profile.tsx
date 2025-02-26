
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile, UserRole, DocumentType } from '@/types/user';
import { AvatarSection } from '@/components/profile/AvatarSection';
import { PersonalInfo } from '@/components/profile/PersonalInfo';
import { ContactInfo } from '@/components/profile/ContactInfo';
import { RoleSelection } from '@/components/profile/RoleSelection';
import { VerificationStatus } from '@/components/profile/sections/VerificationStatus';
import { ProfileCompletion } from '@/components/profile/sections/ProfileCompletion';
import { DocumentsSection } from '@/components/profile/sections/DocumentsSection';
import { UserStats } from '@/components/profile/sections/UserStats';
import { NotificationPreferences } from '@/components/profile/sections/NotificationPreferences';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'renter',
    phone_verified: false,
    email_verified: false,
    verification_status: 'pending',
    preferred_language: 'fr',
    notification_preferences: {
      email: true,
      sms: true,
      push: true,
    },
    stats: {
      total_rentals: 0,
      rating: 0,
      rating_count: 0,
      reservation_compliance: 100,
      acceptance_rate: 100,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    getProfile();
    checkDocuments();
  }, [user, navigate]);

  const getProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*, addresses(*)')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          ...data,
          email: user.email,
          address: data.addresses?.[0],
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre profil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (type: DocumentType, file: File) => {
    try {
      setUploading(true);
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${type}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user_documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('user_documents')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          document_type: type,
          file_url: publicUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Document téléversé",
        description: "Votre document a été envoyé pour vérification",
      });

      checkDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de téléverser le document",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    try {
      if (!user) return;

      const { address, ...profileData } = profile;
      
      // Mise à jour du profil
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Mise à jour de l'adresse
      if (address) {
        const { error: addressError } = await supabase
          .from('addresses')
          .upsert({
            ...address,
            user_id: user.id,
          });

        if (addressError) throw addressError;
      }

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
      });
      
      if (profile.role === 'owner') {
        navigate('/dashboard/owner');
      } else if (profile.role === 'renter') {
        navigate('/dashboard/renter');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({
        title: "Succès",
        description: "Votre photo de profil a été mise à jour",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre photo de profil",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileChange = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleRoleChange = (role: UserRole) => {
    setProfile(prev => ({ ...prev, role }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getMissingItems = () => {
    const missing = [];
    if (!profile.avatar_url) missing.push("Ajouter une photo de profil");
    if (!profile.birthdate) missing.push("Ajouter votre date de naissance");
    if (!profile.phone) missing.push("Ajouter votre numéro de téléphone");
    if (!profile.address) missing.push("Ajouter votre adresse");
    return missing;
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mon Profil</CardTitle>
              <CardDescription>Gérez vos informations personnelles</CardDescription>
            </div>
            <VerificationStatus
              status={profile.verification_status || 'pending'}
              role={profile.role || 'renter'}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <ProfileCompletion
            completion={profile.profile_completion || 0}
            missingItems={getMissingItems()}
          />
          
          <AvatarSection
            avatarUrl={profile.avatar_url}
            uploading={uploading}
            onUpload={uploadAvatar}
          />
          
          <PersonalInfo
            profile={profile}
            onProfileChange={handleProfileChange}
          />
          
          <ContactInfo
            profile={profile}
            onProfileChange={handleProfileChange}
          />
          
          <RoleSelection
            currentRole={profile.role}
            onRoleChange={handleRoleChange}
          />
          
          <DocumentsSection
            documents={[]}
            role={profile.role || 'renter'}
            onUpload={handleDocumentUpload}
          />
          
          <UserStats stats={profile.stats!} />
          
          <NotificationPreferences
            preferences={profile.notification_preferences!}
            onChange={(prefs) => handleProfileChange({ notification_preferences: prefs })}
          />
          
          <Button onClick={updateProfile} className="w-full">
            Sauvegarder les modifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
