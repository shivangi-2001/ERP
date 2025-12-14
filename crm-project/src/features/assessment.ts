import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vulnerability, VulnerabilityType } from "../types/assessment";

interface AssetOption {
  value: string;
  label: string;
}

interface AssetState {
  assessment_types: AssetOption[];
  compliance: AssetOption[];
  rowperpage: number;
  currentpage: number;
  assessment_type_id: number;
  vulnerability_list: VulnerabilityType|null;
  selected_vulnerability: Vulnerability | null;
  isEditing: boolean;
}

const initialState: AssetState = {
  assessment_types: [],
  compliance:[],
  rowperpage: 10,
  currentpage: 1,
  assessment_type_id: 0,
  vulnerability_list: null,
  selected_vulnerability: null,
  isEditing: false,
};

const assestSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setAssessmentTypes: (state, action: PayloadAction<AssetOption[]>) => {
      state.assessment_types = action.payload;
    },

    setCompliance:  (state, action: PayloadAction<AssetOption[]>) => {
      state.compliance = action.payload;
    },

    setVulnerabilityList: (state, action: PayloadAction<VulnerabilityType>) => {
      state.vulnerability_list = action.payload;
    },

    setVulnerability: (state, action: PayloadAction<Vulnerability>) =>{
      state.selected_vulnerability = action.payload;
    },


    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowperpage = action.payload;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentpage = action.payload;
    },

    setAssessmentTypeId: (state, action: PayloadAction<number>) =>{
      state.assessment_type_id = action.payload;
    },

    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
  },
});

export const { setAssessmentTypes, setCompliance, setVulnerabilityList, setVulnerability, setRowsPerPage, setCurrentPage, setAssessmentTypeId, toggleEditing } = assestSlice.actions;
export default assestSlice.reducer;
