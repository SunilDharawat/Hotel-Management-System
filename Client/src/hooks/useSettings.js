import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsAPI } from "@/api/settings";
import { toast } from "sonner";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.getAll,
    select: (data) => data.data,
    staleTime: 300000, // 5 minutes - settings don't change often
  });
};

export const useSettingsList = () => {
  return useQuery({
    queryKey: ["settings", "list"],
    queryFn: settingsAPI.getList,
    select: (data) => data.data.settings,
  });
};

export const useSetting = (key) => {
  return useQuery({
    queryKey: ["setting", key],
    queryFn: () => settingsAPI.getByKey(key),
    enabled: !!key,
    select: (data) => data.data,
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }) => settingsAPI.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Setting updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update setting", {
        description: error.message,
      });
    },
  });
};

export const useUpdateMultipleSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsAPI.updateMultiple,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update settings", {
        description: error.message,
      });
    },
  });
};

export const useResetSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsAPI.resetToDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings reset to defaults");
    },
    onError: (error) => {
      toast.error("Failed to reset settings", {
        description: error.message,
      });
    },
  });
};
