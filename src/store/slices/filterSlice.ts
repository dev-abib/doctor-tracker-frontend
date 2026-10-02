import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  doctorFilterPreferences: {
    specialization: string;
    hospital: string;
    datePreset: string;
    sort: string;
  };
  patientFilterPreferences: {
    condition: string;
    doctor: string;
    gender: string;
    datePreset: string;
    sort: string;
  };
}

const initialState: FilterState = {
  doctorFilterPreferences: {
    specialization: "",
    hospital: "",
    datePreset: "all",
    sort: "newest",
  },
  patientFilterPreferences: {
    condition: "",
    doctor: "",
    gender: "",
    datePreset: "all",
    sort: "newest",
  },
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setDoctorFilterPreferences: (
      state,
      action: PayloadAction<Partial<FilterState["doctorFilterPreferences"]>>
    ) => {
      state.doctorFilterPreferences = {
        ...state.doctorFilterPreferences,
        ...action.payload,
      };
    },
    resetDoctorFilterPreferences: (state) => {
      state.doctorFilterPreferences = initialState.doctorFilterPreferences;
    },
    setPatientFilterPreferences: (
      state,
      action: PayloadAction<Partial<FilterState["patientFilterPreferences"]>>
    ) => {
      state.patientFilterPreferences = {
        ...state.patientFilterPreferences,
        ...action.payload,
      };
    },
    resetPatientFilterPreferences: (state) => {
      state.patientFilterPreferences = initialState.patientFilterPreferences;
    },
  },
});

export const {
  setDoctorFilterPreferences,
  resetDoctorFilterPreferences,
  setPatientFilterPreferences,
  resetPatientFilterPreferences,
} = filterSlice.actions;

export default filterSlice.reducer;
