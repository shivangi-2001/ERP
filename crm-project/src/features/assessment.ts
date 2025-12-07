import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssestOption {
  value: string;
  label: string;
}

interface AssetState {
  assessment_types: AssestOption[];
  rowperpage: number;
  currentpage: number;
}

const initialState: AssetState = {
  assessment_types: [],
  rowperpage: 10,
  currentpage: 1
};

const assestSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    setAssessmentTypes: (state, action: PayloadAction<AssestOption[]>) => {
      state.assessment_types = action.payload;
    },

    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowperpage = action.payload;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentpage = action.payload;
    },
  },
});

export const { setAssessmentTypes, setRowsPerPage, setCurrentPage } = assestSlice.actions;
export default assestSlice.reducer;
