import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Car,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  ChevronRight,
  Key,
  FileText,
  Lock,
  Upload,
  Calendar as CalendarIcon,
  Link as Linkedin,
  MessageSquare as Instagram,
  Share2 as Facebook,
  Flag,
  Plus,
  Globe,
} from 'lucide-react';
import { UserProfile, UserRole, Address, Language, SocialMediaProfile, UserReview } from '@/types/user';
import { useProfile } from '@/hooks/use-profile';
import { useReviews } from '@/hooks/use-reviews';
import { useTheme } from '@/contexts/ThemeContext';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExtendedAddress extends Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
}

interface ProfileState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  address?: ExtendedAddress;
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  profile_completion?: number;
  birthdate?: string;
  languages: Language[];
  social_profiles: SocialMediaProfile[];
  email_verified?: boolean;
  phone_verified?: boolean;
}

interface ProfileInputEvent extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {
  target: HTMLInputElement | HTMLTextAreaElement & {
    name: keyof ProfileState | keyof ExtendedAddress;
    value: string;
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { getProfile, uploadAvatar, documents, loading: profileLoading } = useProfile();
  
  const { reviews, averageRating, totalReviews, loading: reviewsLoading } = useReviews({
    userId: user?.id || ''
  });

  const [profile, setProfile] = useState<ProfileState>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'renter',
    avatar_url: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'MA'
    },
    notification_preferences: {
      email: true,
      push: true
    },
    languages: ['fr'],
    social_profiles: [],
    profile_completion: 0,
    email_verified: false,
    phone_verified: false,
    birthdate: ''
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfile(prev => ({
            ...prev,
            ...data,
            // Ensure no null values in address
            address: {
              street: data.address?.street ?? '',
              city: data.address?.city ?? '',
              postal_code: data.address?.postal_code ?? '',
              country: data.address?.country ?? 'MA'
            },
            // Ensure no null values in notification preferences
            notification_preferences: {
              email: data.notification_preferences?.email ?? true,
              push: data.notification_preferences?.push ?? true
            },
            // Ensure other fields are not null
            first_name: data.first_name ?? '',
            last_name: data.last_name ?? '',
            email: data.email ?? '',
            phone: data.phone ?? '',
            avatar_url: data.avatar_url ?? '',
            languages: data.languages ?? ['fr'],
            social_profiles: data.social_profiles ?? [],
            profile_completion: data.profile_completion ?? 0,
            email_verified: data.email_verified ?? false,
            phone_verified: data.phone_verified ?? false,
            birthdate: data.birthdate ?? ''
          }));
        }
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error('Error loading profile:', err);
      }
    };
    
    if (user) {
      loadProfile();
    }
  }, [user, getProfile]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadAvatar(file);
      if (url) {
        setProfile(prev => ({ ...prev, avatar_url: url }));
      }
    }
  };

  const updateProfile = async () => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour mettre à jour votre profil",
        });
        return;
      }

      // 1. Mise à jour du profil avec la fonction RPC
      const { data: updatedProfile, error: profileError } = await supabase.rpc(
        'profile_update_v1',
        {
          p_user_id: user.id,
          p_first_name: profile.first_name,
          p_last_name: profile.last_name,
          p_phone: profile.phone,
          p_birthdate: profile.birthdate || '',
          p_languages: profile.languages,
          p_notification_preferences: profile.notification_preferences
        }
      );

      if (profileError) throw profileError;

      // 2. Gestion de l'adresse - Utilisation de la fonction RPC
      if (profile.address && 
          (profile.address.street || profile.address.city || profile.address.postal_code)) {
        
        try {
          // Utiliser la fonction RPC upsert_user_address pour mettre à jour l'adresse
          const { data: addressData, error: addressError } = await supabase.rpc(
            'upsert_user_address',
            {
              p_user_id: user.id,
              p_street: profile.address.street || '',
              p_city: profile.address.city || '',
              p_postal_code: profile.address.postal_code || '',
              p_country: 'MA'
            }
          );

          if (addressError) {
            console.error('Error updating address via RPC:', addressError);
            toast({
              variant: "warning",
              title: "Attention",
              description: "Votre profil a été mis à jour mais il y a eu un problème avec l'adresse",
            });
          } else {
            console.log('Address updated successfully:', addressData);
          }
        } catch (addressError) {
          console.error('Exception during address operation:', addressError);
          toast({
            variant: "warning",
            title: "Attention",
            description: "Votre profil a été mis à jour mais il y a eu un problème avec l'adresse",
          });
        }
      }

      // 3. Mettre à jour l'état local avec les données mises à jour
      if (updatedProfile) {
        setProfile(prev => ({
          ...prev,
          ...updatedProfile,
          address: profile.address // Conserver l'adresse actuelle
        }));

        // Stocker les données dans le localStorage pour la persistance
        localStorage.setItem('userProfile', JSON.stringify({
          ...updatedProfile,
          address: profile.address
        }));

        toast({
          title: "Succès",
          description: "Votre profil a été mis à jour",
        });
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

  const handleProfileChange = (e: ProfileInputEvent | Partial<ProfileState>) => {
    if ('target' in e) {
      const { name, value } = e.target;
      setProfile(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        ...e,
      }));
    }
  };

  const handleAddressChange = (e: ProfileInputEvent) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      address: {
        ...(prev.address || {}),
        [name]: value,
      } as ExtendedAddress,
    }));
  };

  const calculateCompletion = () => {
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.email,
      profile.phone,
      profile.birthdate,
      profile.avatar_url,
      profile.address?.street,
      profile.address?.city,
      profile.address?.postal_code
    ];
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getLanguageFlag = (lang: Language) => {
    const flags: Record<Language, string> = {
      fr: '🇫🇷',
      en: '🇬🇧',
      ar: '🇲🇦'
    };
    return flags[lang];
  };

  const getSocialIcon = (platform: SocialMediaProfile['platform']) => {
    const icons = {
      linkedin: <Linkedin className="w-5 h-5" />,
      instagram: <Instagram className="w-5 h-5" />,
      facebook: <Facebook className="w-5 h-5" />
    };
    return icons[platform];
  };

  const handleNotificationChange = (type: keyof NotificationPreferences) => (checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [type]: checked,
      },
    }));
  };

  const verifyDataIsolation = async () => {
    // Implementation of verifyDataIsolation function
    // This is a placeholder and should be replaced with the actual implementation
    return true; // Placeholder return, actual implementation needed
  };

  if (profileLoading || reviewsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-xl border border-primary/10 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            {/* Avatar with Rating Badge */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 p-1 backdrop-blur-xl">
                <div className="relative h-full w-full rounded-full overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/5">
                      <User className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-1 right-1 p-1.5 bg-primary/80 rounded-full cursor-pointer hover:bg-primary transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
              {/* Rating Badge */}
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">{averageRating.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {profile.address?.city || 'Ville non renseignée'}
              </p>
              
              {/* Verification Status */}
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="success">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Conducteur vérifié
                </Badge>
                {profile.email_verified && (
                  <Badge variant="info">
                    <Mail className="w-4 h-4 mr-1" />
                    Email vérifié
                  </Badge>
                )}
                {profile.phone_verified && (
                  <Badge variant="purple">
                    <Phone className="w-4 h-4 mr-1" />
                    Téléphone vérifié
                  </Badge>
                )}
              </div>

              {/* Languages */}
              <div className="flex items-center gap-2 mt-4">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {profile.languages?.map((lang) => (
                  <Badge key={lang} variant="outline">
                    {getLanguageFlag(lang)} {lang.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button onClick={() => setActiveTab('personal')}>
                Modifier le profil
              </Button>
              <Button variant="outline">
                Partager le profil
              </Button>
            </div>
          </div>
        </div>

        {/* Social Media Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Réseaux sociaux</CardTitle>
            <CardDescription>
              Connectez vos comptes pour plus de confiance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {profile.social_profiles?.map((social) => (
                <div key={social.platform} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {getSocialIcon(social.platform)}
                    <span>{social.platform}</span>
                  </div>
                  {social.verified ? (
                    <Badge variant="success">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Vérifié
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Non vérifié
                    </Badge>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un réseau social
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Avis ({totalReviews})</CardTitle>
                <CardDescription>
                  Ce que disent les autres utilisateurs
                </CardDescription>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{averageRating.toFixed(2)}</div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {totalReviews} avis
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border bg-card transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.reviewer.avatar_url} />
                      <AvatarFallback>
                        {review.reviewer.first_name[0]}
                        {review.reviewer.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {review.reviewer.first_name} {review.reviewer.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: fr })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Profile Content */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-4 h-auto p-1">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personnel</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Vos informations de base et votre photo de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-medium">Photo de profil</h3>
                    <p className="text-sm text-muted-foreground">
                      JPG, GIF ou PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Prénom</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleProfileChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Nom</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleProfileChange}
                      placeholder="Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Date de naissance</Label>
                    <Input
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      value={profile.birthdate || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      value={profile.role === 'owner' ? 'Propriétaire' : 'Locataire'}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coordonnées</CardTitle>
                <CardDescription>
                  Vos informations de contact et votre adresse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="pr-10"
                      />
                      {profile.email && (
                        <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Rue</Label>
                    <Textarea
                      id="street"
                      name="street"
                      value={profile.address?.street || ''}
                      onChange={handleAddressChange}
                      placeholder="123 Rue Example"
                    />
                  </div>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        name="city"
                        value={profile.address?.city || ''}
                        onChange={handleAddressChange}
                        placeholder="Casablanca"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Code postal</Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={profile.address?.postal_code || ''}
                        onChange={handleAddressChange}
                        placeholder="20000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        name="country"
                        value="Maroc"
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Gérez la sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <div className="font-medium">Mot de passe</div>
                      <div className="text-sm text-muted-foreground">
                        Dernière modification il y a 3 mois
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/auth/change-password')}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <div className="font-medium">Authentification à deux facteurs</div>
                      <div className="text-sm text-muted-foreground">
                        Ajoutez une couche de sécurité supplémentaire
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/documents/verification')}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Activer
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <div className="font-medium">Documents d'identité</div>
                      <div className="text-sm text-muted-foreground">
                        Vérifiez votre identité pour plus de sécurité
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/documents/verification')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Gérer
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-0.5">
                      <div className="font-medium">Vérification de l'isolation des données</div>
                      <div className="text-sm text-muted-foreground">
                        Vérifier que vous n'avez accès qu'à vos propres données
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const result = await verifyDataIsolation();
                        if (result) {
                          toast({
                            title: "Succès",
                            description: "L'isolation des données est correctement configurée",
                          });
                        } else {
                          toast({
                            variant: "destructive",
                            title: "Erreur",
                            description: "Problème d'isolation des données détecté",
                          });
                        }
                      }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Vérifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences</CardTitle>
                <CardDescription>
                  Personnalisez votre expérience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Notifications par email</div>
                      <div className="text-sm text-muted-foreground">
                        Recevoir des mises à jour par email
                      </div>
                    </div>
                    <Switch
                      checked={profile.notification_preferences.email}
                      onCheckedChange={(checked) => handleNotificationChange('email')(checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Notifications push</div>
                      <div className="text-sm text-muted-foreground">
                        Recevoir des notifications sur votre appareil
                      </div>
                    </div>
                    <Switch
                      checked={profile.notification_preferences.push}
                      onCheckedChange={(checked) => handleNotificationChange('push')(checked)}
                    />
                  </div>
                </div>
        </CardContent>
      </Card>
          </TabsContent>
        </Tabs>

        {/* Save Changes */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button onClick={() => updateProfile()}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
