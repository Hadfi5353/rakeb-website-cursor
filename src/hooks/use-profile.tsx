
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile, UserDocument, DocumentType } from '@/types/user';

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const getProfile = async () => {
    try {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*, addresses(*)')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          email: user.email,
          address: data.addresses?.[0],
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre profil",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkDocuments = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos documents",
      });
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

  return {
    getProfile,
    checkDocuments,
    handleDocumentUpload,
    documents,
    loading,
    uploading,
    setUploading
  };
};
