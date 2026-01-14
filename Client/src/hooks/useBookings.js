import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsAPI } from "@/api/bookings";
import { toast } from "sonner";

export const useBookings = (params = {}) => {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => bookingsAPI.getAll(params),
    select: (data) => data.data,
  });
};

export const useBooking = (id) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingsAPI.getById(id),
    enabled: !!id,
    select: (data) => data.data,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Booking created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create booking", {
        description: error.message,
      });
    },
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsAPI.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Check-in successful");
    },
    onError: (error) => {
      toast.error("Check-in failed", {
        description: error.message,
      });
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsAPI.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Check-out successful");
    },
    onError: (error) => {
      toast.error("Check-out failed", {
        description: error.message,
      });
    },
  });
};

export const useTodayArrivals = () => {
  return useQuery({
    queryKey: ["bookings", "today", "arrivals"],
    queryFn: bookingsAPI.getTodayArrivals,
    select: (data) => data.data,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useTodayDepartures = () => {
  return useQuery({
    queryKey: ["bookings", "today", "departures"],
    queryFn: bookingsAPI.getTodayDepartures,
    select: (data) => data.data,
    refetchInterval: 60000,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cancellation_reason }) =>
      bookingsAPI.cancel(id, cancellation_reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Booking cancelled successfully");
    },
    onError: (error) => {
      toast.error("Failed to cancel booking", {
        description: error.message,
      });
    },
  });
};
