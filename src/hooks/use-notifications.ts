import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'booking_confirmed' | 'booking_rejected' | 'booking_cancelled' | 'booking_request' | 'message' | 'system' | 'review';
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  related_id?: string;
  user_id: string;
}

export interface FormattedNotification {
  id: string;
  type: 'booking' | 'message' | 'system' | 'review';
  subtype?: string; // Pour stocker le type spécifique (booking_confirmed, booking_rejected, etc.)
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
  relatedId?: string;
  actionText?: string; // Texte personnalisé pour le bouton d'action
  actionLink?: string; // Lien personnalisé pour le bouton d'action
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<FormattedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fonction pour récupérer les notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Formater les notifications pour l'affichage
      const formattedNotifications: FormattedNotification[] = data.map((notification: Notification) => {
        // Déterminer le type d'affichage
        let displayType: 'booking' | 'message' | 'system' | 'review' = 'system';
        let link: string | undefined = undefined;
        let actionText: string | undefined = undefined;
        let actionLink: string | undefined = undefined;

        // Traiter les différents types de notifications
        if (notification.type.startsWith('booking_')) {
          displayType = 'booking';
          
          if (notification.related_id) {
            link = `/bookings/${notification.related_id}`;
            
            // Personnaliser l'action en fonction du sous-type
            switch (notification.type) {
              case 'booking_confirmed':
                actionText = 'Voir les détails de la réservation';
                break;
              case 'booking_rejected':
                actionText = 'Chercher d\'autres véhicules';
                actionLink = '/cars/search';
                break;
              case 'booking_request':
                actionText = 'Répondre à la demande';
                break;
              case 'booking_cancelled':
                actionText = 'Voir les détails';
                break;
            }
          }
        } else if (notification.type === 'message') {
          displayType = 'message';
          if (notification.related_id) {
            link = `/messages/${notification.related_id}`;
            actionText = 'Répondre au message';
          }
        } else if (notification.type === 'review') {
          displayType = 'review';
          if (notification.related_id) {
            link = `/reviews/${notification.related_id}`;
            actionText = 'Voir l\'avis';
          }
        }

        return {
          id: notification.id,
          type: displayType,
          subtype: notification.type,
          title: notification.title,
          message: notification.message,
          date: notification.created_at,
          read: notification.is_read,
          link,
          relatedId: notification.related_id,
          actionText,
          actionLink: actionLink || link
        };
      });

      setNotifications(formattedNotifications);
      
      // Calculer le nombre de notifications non lues
      const unread = formattedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications:', err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fonction pour marquer une notification comme lue
  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );

      // Recalculer le nombre de notifications non lues
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur lors du marquage de la notification comme lue:', err);
      toast.error('Impossible de marquer la notification comme lue');
    }
  }, [user]);

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );

      // Mettre à jour le compteur
      setUnreadCount(0);
      
      toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', err);
      toast.error('Impossible de marquer toutes les notifications comme lues');
    }
  }, [user]);

  // Configurer la souscription aux nouvelles notifications
  useEffect(() => {
    if (!user) return;

    // Récupérer les notifications au chargement
    fetchNotifications();

    // S'abonner aux changements de notifications
    const subscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Changement dans les notifications:', payload);
        
        // Rafraîchir les notifications
        fetchNotifications();
        
        // Afficher une notification pour les nouveaux éléments
        if (payload.eventType === 'INSERT') {
          const newNotif = payload.new as Notification;
          
          // Personnaliser le toast en fonction du type de notification
          let toastType: 'info' | 'success' | 'error' | 'warning' = 'info';
          
          if (newNotif.type === 'booking_confirmed') {
            toastType = 'success';
          } else if (newNotif.type === 'booking_rejected') {
            toastType = 'error';
          } else if (newNotif.type === 'booking_cancelled') {
            toastType = 'warning';
          } else if (newNotif.type === 'booking_request') {
            toastType = 'info';
          }
          
          toast[toastType](newNotif.title, {
            description: newNotif.message,
            action: {
              label: 'Voir',
              onClick: () => {
                // Marquer comme lu et rediriger si nécessaire
                markAsRead(newNotif.id);
                if (newNotif.related_id) {
                  if (newNotif.type.startsWith('booking_')) {
                    window.location.href = `/bookings/${newNotif.related_id}`;
                  } else if (newNotif.type === 'message') {
                    window.location.href = `/messages/${newNotif.related_id}`;
                  } else if (newNotif.type === 'review') {
                    window.location.href = `/reviews/${newNotif.related_id}`;
                  }
                }
              }
            }
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchNotifications, markAsRead]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  };
}; 