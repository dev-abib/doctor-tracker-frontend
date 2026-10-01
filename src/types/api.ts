export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Array<{ field?: string; message: string }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin";
  createdAt: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount?: number;
  recentPatients?: Patient[];
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  condition: string;
  doctor: string | Doctor | { _id: string; name: string; specialization: string; hospital?: string };
  visitDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
  avgPatientsPerDoctor: number;
  newPatientsThisMonth: number;
  newPatientsLastMonth: number;
  momGrowthPercentage: number;
}

export interface PatientsPerDoctorStat {
  _id: string;
  doctorName: string;
  specialization: string;
  hospital: string;
  patientCount: number;
}

export interface ConditionStat {
  condition: string;
  count: number;
}

export interface SpecializationStat {
  specialization: string;
  count: number;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface DashboardStats {
  summary: DashboardSummary;
  charts: {
    patientsPerDoctor: PatientsPerDoctorStat[];
    patientsByCondition: ConditionStat[];
    doctorsBySpecialization: SpecializationStat[];
    patientsOverTime: {
      day: TimeSeriesPoint[];
      week: TimeSeriesPoint[];
      month: TimeSeriesPoint[];
    };
  };
  recentPatients: Patient[];
}
