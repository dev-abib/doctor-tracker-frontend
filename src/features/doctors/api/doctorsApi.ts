import { apiClient } from "@/lib/axios";
import { ApiResponse, Doctor, Patient, PaginationMeta } from "@/types/api";

export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}

export interface CreateDoctorPayload {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  image?: string;
}

export interface CreatePatientUnderDoctorPayload {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  condition: string;
  visitDate?: string;
}

export const doctorsApi = {
  list: async (
    params: DoctorQueryParams
  ): Promise<{ doctors: Doctor[]; meta: PaginationMeta }> => {
    const res = await apiClient.get<ApiResponse<Doctor[]>>("/doctors", {
      params,
    });
    return {
      doctors: res.data.data || [],
      meta: res.data.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  },

  getById: async (id: string): Promise<Doctor> => {
    const res = await apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateDoctorPayload): Promise<Doctor> => {
    const res = await apiClient.post<ApiResponse<Doctor>>("/doctors", data);
    return res.data.data!;
  },

  update: async (id: string, data: Partial<CreateDoctorPayload>): Promise<Doctor> => {
    const res = await apiClient.patch<ApiResponse<Doctor>>(`/doctors/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<{ deletedDoctorId: string; deletedPatientsCount: number }> => {
    const res = await apiClient.delete<ApiResponse<{ deletedDoctorId: string; deletedPatientsCount: number }>>(
      `/doctors/${id}`
    );
    return res.data.data!;
  },

  getPatients: async (
    id: string,
    params: { page?: number; limit?: number; search?: string }
  ): Promise<{ doctor: { _id: string; name: string }; patients: Patient[]; meta: PaginationMeta }> => {
    const res = await apiClient.get<
      ApiResponse<{ doctor: { _id: string; name: string }; patients: Patient[] }>
    >(`/doctors/${id}/patients`, { params });
    return {
      doctor: res.data.data!.doctor,
      patients: res.data.data!.patients,
      meta: res.data.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  },

  addPatient: async (
    doctorId: string,
    data: CreatePatientUnderDoctorPayload
  ): Promise<Patient> => {
    const res = await apiClient.post<ApiResponse<Patient>>(
      `/doctors/${doctorId}/patients`,
      data
    );
    return res.data.data!;
  },

  deletePatient: async (
    doctorId: string,
    patientId: string
  ): Promise<{ deletedPatientId: string }> => {
    const res = await apiClient.delete<ApiResponse<{ deletedPatientId: string }>>(
      `/doctors/${doctorId}/patients/${patientId}`
    );
    return res.data.data!;
  },

  getFilters: async (): Promise<{
    specializations: string[];
    hospitals: string[];
  }> => {
    const res = await apiClient.get<
      ApiResponse<{ specializations: string[]; hospitals: string[] }>
    >("/doctors/filters/options");
    return res.data.data || { specializations: [], hospitals: [] };
  },
};
