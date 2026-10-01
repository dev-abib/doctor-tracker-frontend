import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  doctorsApi,
  DoctorQueryParams,
  CreateDoctorPayload,
  CreatePatientUnderDoctorPayload,
} from "../api/doctorsApi";

export const useDoctorsList = (params: DoctorQueryParams) => {
  return useQuery({
    queryKey: ["doctors", "list", params],
    queryFn: () => doctorsApi.list(params),
    placeholderData: keepPreviousData,
  });
};

export const useDoctorDetail = (id: string) => {
  return useQuery({
    queryKey: ["doctors", "detail", id],
    queryFn: () => doctorsApi.getById(id),
    enabled: !!id,
  });
};

export const useDoctorPatients = (
  id: string,
  params: { page?: number; limit?: number; search?: string }
) => {
  return useQuery({
    queryKey: ["doctors", "patients", id, params],
    queryFn: () => doctorsApi.getPatients(id, params),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
};

export const useDoctorFilters = () => {
  return useQuery({
    queryKey: ["doctors", "filters"],
    queryFn: () => doctorsApi.getFilters(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDoctorPayload) => doctorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Doctor created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.customMessage || "Failed to create doctor");
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDoctorPayload> }) =>
      doctorsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", "detail", variables.id] });
      toast.success("Doctor information updated!");
    },
    onError: (err: any) => {
      toast.error(err.customMessage || "Failed to update doctor");
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorsApi.delete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(
        `Doctor deleted! (${data.deletedPatientsCount} associated patient(s) cleaned up)`
      );
    },
    onError: (err: any) => {
      toast.error(err.customMessage || "Failed to delete doctor");
    },
  });
};

export const useAddPatientToDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      data,
    }: {
      doctorId: string;
      data: CreatePatientUnderDoctorPayload;
    }) => doctorsApi.addPatient(doctorId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["doctors", "patients", variables.doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["doctors", "detail", variables.doctorId],
      });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Patient successfully registered under doctor!");
    },
    onError: (err: any) => {
      toast.error(err.customMessage || "Failed to add patient");
    },
  });
};

export const useDeletePatientFromDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      patientId,
    }: {
      doctorId: string;
      patientId: string;
    }) => doctorsApi.deletePatient(doctorId, patientId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["doctors", "patients", variables.doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["doctors", "detail", variables.doctorId],
      });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Patient removed from doctor roster.");
    },
    onError: (err: any) => {
      toast.error(err.customMessage || "Failed to remove patient");
    },
  });
};
