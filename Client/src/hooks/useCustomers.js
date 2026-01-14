import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersAPI } from "@/api/customers";
import { toast } from "sonner";

export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customersAPI.getAll(params),
    select: (data) => data.data.customers,
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => customersAPI.getById(id),
    enabled: !!id,
    select: (data) => data.data,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create customer", {
        description: error.message,
      });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => customersAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
      toast.success("Customer updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update customer", {
        description: error.message,
      });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete customer", {
        description: error.message,
      });
    },
  });
};
