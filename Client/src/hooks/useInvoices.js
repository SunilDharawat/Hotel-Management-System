import { invoicesAPI } from "@/api/invoices";
import { useQuery } from "@tanstack/react-query";

export const useInvoices = (params = {}) => {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => invoicesAPI.getAll(params),
    select: (response) => response.data.invoices ?? [],
  });
};
