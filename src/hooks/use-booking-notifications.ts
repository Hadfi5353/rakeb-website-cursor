import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useBookingNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Subscribe to new booking notifications for owners
    const subscription = supabase
      .channel('new-booking-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `owner_id=eq.${user.id}`,
        },
        (payload) => {
          // Show notification for new booking
          toast.custom((t) => (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg">New Booking Request</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You have received a new booking request for your vehicle.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    handleBookingAction(payload.new.id, 'accepted');
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    handleBookingAction(payload.new.id, 'refused');
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                >
                  Refuse
                </button>
              </div>
            </div>
          ), {
            duration: 0, // Notification won't auto-dismiss
            position: 'top-right',
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
};

const handleBookingAction = async (bookingId: string, status: 'accepted' | 'refused') => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) throw error;

    toast.success(`Booking ${status} successfully`);
  } catch (error) {
    console.error('Error updating booking:', error);
    toast.error('Failed to update booking status');
  }
}; 