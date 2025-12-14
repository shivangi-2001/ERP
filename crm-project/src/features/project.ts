import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientDetails, ClientAddress, ClientDetail, ClientTeam } from "../types/project";

interface ProjectState {
  clientdetails: ClientDetails;
  clientdetail: ClientDetail | null;

  clientaddress: ClientAddress | null;
  clientteam: ClientTeam | null;

  rowperpage: number;
  currentpage: number;

  isEditing: boolean;
  isEditingTeam: boolean;
}

const initialState: ProjectState = {
  clientdetails: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  clientdetail: null,
  clientaddress: null,
  clientteam: null,
  rowperpage: 10,
  currentpage: 1,
  isEditing: false,
  isEditingTeam: false,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setClientDetails: (state, action: PayloadAction<ClientDetails>) => {
      state.clientdetails = action.payload;
    },

    setClientDetail: (state, action: PayloadAction<ClientDetail>) => {
      state.clientdetail = action.payload;
      state.clientaddress = action.payload.address || null;
      state.clientteam =
        action.payload.teams && action.payload.teams.length > 0
          ? action.payload.teams[0]
          : null;
    },

    setClientTeam: (state, action: PayloadAction<ClientTeam>) => {
      state.clientteam = action.payload;
    },

    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowperpage = action.payload;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentpage = action.payload;
    },

    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },

    toggleEditingTeam: (state) => {
      state.isEditingTeam = !state.isEditingTeam;
    },

  },
});

export const {
  setClientDetail,
  setClientDetails,
  setClientTeam,
  setRowsPerPage,
  setCurrentPage,
  toggleEditing,
  toggleEditingTeam,
} = projectSlice.actions;
export default projectSlice.reducer;
