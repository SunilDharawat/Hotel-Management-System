import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { smsAPI, templatesAPI } from "@/api/sms";
import { toast } from "sonner";

export const useSMSMessages = (params = {}) => {
  return useQuery({
    queryKey: ["sms-messages", params],
    queryFn: () => smsAPI.getAll(params),
    select: (data) => data.data,
  });
};

export const useSMSStats = (params = {}) => {
  return useQuery({
    queryKey: ["sms-stats", params],
    queryFn: () => smsAPI.getStats(params),
    select: (data) => data.data,
  });
};

export const useSendSMS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: smsAPI.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sms-messages"] });
      queryClient.invalidateQueries({ queryKey: ["sms-stats"] });
      toast.success("SMS sent successfully");
    },
    onError: (error) => {
      toast.error("Failed to send SMS", {
        description: error.message,
      });
    },
  });
};

export const useSendBulkSMS = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: smsAPI.sendBulk,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sms-messages"] });
      toast.success(
        `Sent ${data.data.sent.length} messages, ${data.data.failed.length} failed`
      );
    },
    onError: (error) => {
      toast.error("Failed to send bulk SMS", {
        description: error.message,
      });
    },
  });
};

export const useSMSTemplates = (params = {}) => {
  return useQuery({
    queryKey: ["sms-templates", params],
    queryFn: () => templatesAPI.getAll(params),
    select: (data) => data.data.templates,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: templatesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sms-templates"] });
      toast.success("Template created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create template", {
        description: error.message,
      });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => templatesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sms-templates"] });
      toast.success("Template updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update template", {
        description: error.message,
      });
    },
  });
};
