import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { donationDayService } from "@/services/donation-days.service";

export const useDonationDays = (filters: any) => {
  return useQuery({
    queryKey: ["donation-days", filters],
    queryFn: () => donationDayService.getAll(filters),
  });
};

export const useSuspendDonationDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => donationDayService.suspend(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["donation-days"],
      });
    },
  });
};