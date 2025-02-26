
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserCircle, Phone, Mail, Camera } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile } from '@/types/user';

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
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <UserCircle className="w-32 h-32 text-gray-400" />
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                Prénom
              </label>
              <Input
                id="firstName"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Nom
              </label>
              <Input
                id="lastName"
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">{profile.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <Input
                placeholder="Numéro de téléphone"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Je suis un</label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={profile.role === 'renter' ? 'default' : 'outline'}
                onClick={() => setProfile({ ...profile, role: 'renter' })}
                className="w-full"
              >
                Locataire
              </Button>
              <Button
                variant={profile.role === 'owner' ? 'default' : 'outline'}
                onClick={() => setProfile({ ...profile, role: 'owner' })}
                className="w-full"
              >
                Propriétaire
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={updateProfile} className="w-full">
            Sauvegarder les modifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
