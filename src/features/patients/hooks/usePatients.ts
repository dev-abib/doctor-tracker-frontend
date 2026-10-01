import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  patientsApi,
  PatientQueryParams,
  PatientPayload,
} from "../api/patientsApi";

export const usePatientsList = (params: PatientQueryParams) => {
  return useQuery({
    queryKey: ["patients", "list", params],
    queryFn: () => patientsApi.list(params),
    placeholderData: keepPreviousData,
  });
};

export const usePatientDetail = (id: string) => {
  return useQuery({
    queryKey: ["patients", "detail", id],
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
};

export const usePatientFilters = () => {
  return useQuery({
    queryKey: ["patients", "filters"],
    queryFn: () => patientsApi.getFilters(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatientPayload) => patientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Patient registered successfully!");
    },
    onError: (err: any) => {
      toast.error(err.customMessage || "Failed to register patient");
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PatientPayload> }) =>
      patientsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Patient record updated!");
    },
    onError: (err: any) => {
      toast.error(err.customMessage || "Failed to update patient record");
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Patient record deleted successfully.");
    },
    onError: (err: any) => {
      toast.error(err.customMessage || "Failed to delete patient");
    },
  });
};
