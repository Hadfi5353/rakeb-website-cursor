
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile, UserRole } from '@/types/user';
import { AvatarSection } from '@/components/profile/AvatarSection';
import { PersonalInfo } from '@/components/profile/PersonalInfo';
import { ContactInfo } from '@/components/profile/ContactInfo';
import { RoleSelection } from '@/components/profile/RoleSelection';

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
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    getProfile();
    checkDocuments();
  }, [user, navigate]);

  const checkDocuments = async () => {
    if (!user) return;

    try {
      const { data: documents, error } = await supabase
        .from('user_documents')
        .select('document_type, status')
        .eq('user_id', user.id);

      if (error) throw error;

      const hasRequiredDocuments = documents?.some(doc => doc.status === 'approved');
      
      if (!hasRequiredDocuments) {
        toast({
          title: "Documents requis",
          description: "Veuillez télécharger vos documents pour continuer",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/documents/verification')}
            >
              Télécharger
            </Button>
          ),
        });
      }
    } catch (error) {
      console.error('Error checking documents:', error);
    }
  };

  useEffect(() => {
    if (profile.role === 'owner') {
      navigate('/dashboard/owner');
    } else if (profile.role === 'renter') {
      navigate('/dashboard/renter');
    }
  }, [profile.role, navigate]);

  const getProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          ...data,
          email: user.email,
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

  const updateProfile = async () => {
    try {
      if (!user) return;

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
      });
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

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Gérez vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          <Button onClick={updateProfile} className="w-full">
            Sauvegarder les modifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
