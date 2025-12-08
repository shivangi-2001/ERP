import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UrlMapping, UrlMappingType } from "../types/urlMapping";
import { EmployeeType } from "../types/myTeam";

interface myTeamState {
  urlMappingList: UrlMappingType;
  url_mapping: UrlMapping | null;
  rowperpage: number;
  currentpage: number;
  isEditing: boolean;
}

const initialState: myTeamState = {
  urlMappingList: {
    count: 0,
    next: null,
    previous: null,
    results: [],
  },
  url_mapping: null,
  rowperpage: 5,
  currentpage: 1,
  isEditing: false,
};

const urlMappingSlice = createSlice({
  name: "urlMapping",
  initialState,
  reducers: {
    setUrlMappingList: (state, action: PayloadAction<UrlMappingType>) => {
      state.urlMappingList = action.payload;
    },
    setUrlMapping: (state, action: PayloadAction<UrlMapping>) => {
      state.url_mapping = action.payload;
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
  },
});

export const {
  setUrlMappingList,
  setUrlMapping,
  setRowsPerPage,
  setCurrentPage,
  toggleEditing,
} = urlMappingSlice.actions;
export default urlMappingSlice.reducer;
