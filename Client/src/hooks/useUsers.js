import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/api/users";
import { toast } from "sonner";

export function useUserActions() {
  const queryClient = useQueryClient();

  // Create User
  const createMutation = useMutation({
    mutationFn: (data) => usersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("New user created successfully");
    },
    onError: (error) => toast.error(error.message || "Failed to create user"),
  });

  // Update User
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error) => toast.error("Update failed" + error.message),
  });

  // Inactive/Delete User
  const deleteMutation = useMutation({
    mutationFn: (id) => usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status changed");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
