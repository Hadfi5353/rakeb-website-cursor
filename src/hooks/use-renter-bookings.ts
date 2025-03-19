import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingStatus } from '@/types/booking';
import { bookingsApi } from '@/lib/api';

export interface RenterBooking {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  total_price: number;
  base_price: number;
  service_fee: number;
  pickup_location: string;
  return_location: string;
  duration_days: number;
  created_at: string;
  
  // Vehicle details
  vehicle?: {
    make: string;
    model: string;
    year: number;
    images: string[];
    owner_id: string;
  };
  
  // Owner details
  owner?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

export const useRenterBookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['renter-bookings'],
    queryFn: async () => {
      const response = await bookingsApi.getRenterBookings();
      return response.data as RenterBooking[];
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await bookingsApi.cancelBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renter-bookings'] });
    }
  });

  const cancelBooking = async (bookingId: string) => {
    await cancelMutation.mutateAsync(bookingId);
  };

  return {
    bookings,
    isLoading,
    error,
    cancelBooking,
    isUpdating: cancelMutation.isPending
  };
}; 