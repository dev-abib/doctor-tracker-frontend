import { apiClient } from "@/lib/axios";
import { ApiResponse, Patient, PaginationMeta } from "@/types/api";

export interface PatientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  doctor?: string;
  gender?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

export interface PatientPayload {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  image?: string;
  condition: string;
  doctor: string;
  visitDate?: string;
}

export const patientsApi = {
  list: async (
    params: PatientQueryParams
  ): Promise<{ patients: Patient[]; meta: PaginationMeta }> => {
    const res = await apiClient.get<ApiResponse<Patient[]>>("/patients", {
      params,
    });
    return {
      patients: res.data.data || [],
      meta: res.data.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  },

  getById: async (id: string): Promise<Patient> => {
    const res = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return res.data.data!;
  },

  create: async (data: PatientPayload): Promise<Patient> => {
    const res = await apiClient.post<ApiResponse<Patient>>("/patients", data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<PatientPayload>): Promise<Patient> => {
    const res = await apiClient.patch<ApiResponse<Patient>>(`/patients/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<{ deletedPatientId: string }> => {
    const res = await apiClient.delete<ApiResponse<{ deletedPatientId: string }>>(
      `/patients/${id}`
    );
    return res.data.data!;
  },

  getFilters: async (): Promise<{
    conditions: string[];
    doctors: Array<{ _id: string; name: string; specialization: string; hospital: string }>;
  }> => {
    const res = await apiClient.get<
      ApiResponse<{
        conditions: string[];
        doctors: Array<{ _id: string; name: string; specialization: string; hospital: string }>;
      }>
    >("/patients/filters/options");
    return res.data.data || { conditions: [], doctors: [] };
  },
};
