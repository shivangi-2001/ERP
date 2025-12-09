import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ClientDetails,
  ClientAddress,
  ClientDetail,
  ClientTeam,
  ClientAssessment,
  UrlMapping,
  UrlMappingType
} from "../types/project";

interface ProjectState {
  clientdetails: ClientDetails;
  clientdetail: ClientDetail | null;

  clientaddress: ClientAddress | null;
  clientteam: ClientTeam | null;

  rowperpage: number;
  currentpage: number;
  isEditing: boolean;
  isEditingTeam: boolean;
  
  client_assesment_id: ClientAssessment | null;

  urlMappingList: UrlMappingType;
  url_mapping: UrlMapping | null;
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
  rowperpage: 5,
  currentpage: 1,
  isEditing: false,
  isEditingTeam: false,
  client_assesment_id: null,
  urlMappingList: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  url_mapping: null,
};

const projectSlice = createSlice({
  name: "asset",
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

    setClientAssessmentTypeId: (state, action: PayloadAction<ClientAssessment>) => {
      state.client_assesment_id = action.payload;
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
    setUrlMappingList: (state, action: PayloadAction<UrlMappingType>) => {
      state.urlMappingList = action.payload;
    },
    setUrlMapping: (state, action: PayloadAction<UrlMapping>) => {
      state.url_mapping = action.payload;
    },
  },
});

export const {
  setClientDetail,
  setClientDetails,
  setClientTeam,
  setClientAssessmentTypeId,
  setRowsPerPage,
  setCurrentPage,
  toggleEditing,
  toggleEditingTeam,
  setUrlMapping,
  setUrlMappingList
} = projectSlice.actions;
export default projectSlice.reducer;
