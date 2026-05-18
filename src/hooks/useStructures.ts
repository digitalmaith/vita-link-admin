import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { structuresService, type StructuresFilters } from "@/services/structures.service";
import { toast } from "sonner";

export function useStructures(filters?: StructuresFilters) {
  return useQuery({
    queryKey: ["structures", filters],
    queryFn: () => structuresService.getAll(filters),
  });
}

export function useVerifyStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => structuresService.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
      toast.success("Structure certifiée avec succès");
    },
    onError: () => toast.error("Erreur lors de la certification"),
  });
}

export function useSuspendStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      structuresService.suspend(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
      toast.success("Structure suspendue");
    },
    onError: () => toast.error("Erreur lors de la suspension"),
  });
}

export function useRejectStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      structuresService.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
      toast.success("Structure rejetée");
    },
    onError: () => toast.error("Erreur lors du rejet"),
  });
}