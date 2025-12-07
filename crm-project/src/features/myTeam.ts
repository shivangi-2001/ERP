import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "../types/myTeam";

interface AssestOption {
  value: string;
  label: string;
}

interface myTeamState {
  selected_employee: Employee | null ;
  team_groups: AssestOption[];
  rowperpage: number;
  currentpage: number;
  isEditing: boolean;
}

const initialState: myTeamState = {
  selected_employee: null,
  team_groups: [],
  rowperpage: 5,
  currentpage: 1,
  isEditing: false
};

const myTeamSlice = createSlice({
  name: "myTeam",
  initialState,
  reducers: {
    setTeamTypes: (state, action: PayloadAction<AssestOption[]>) => {
      state.team_groups = action.payload;
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selected_employee = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowperpage = action.payload;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentpage = action.payload;
    },

    toggleEditing: (state) => {
      state.isEditing=!state.isEditing
    }
  },
});

export const { setTeamTypes, setSelectedEmployee, setRowsPerPage, setCurrentPage, toggleEditing } = myTeamSlice.actions;
export default myTeamSlice.reducer;
