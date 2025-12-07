import { createApi } from "@reduxjs/toolkit/query/react";
import baseAuthHeader from "./baseAuthHeader";
import {  Team, TeamType,  Employee, EmployeeType,  } from "../types/myTeam";

export const myTeamApi = createApi({
  reducerPath: "myTeamApi",
  baseQuery: baseAuthHeader,
  tagTypes: ["team", "employee"],
  endpoints: (builder) => ({
    // CREATE Team 
    addTeam: builder.mutation<Team, Partial<Team>>({
      query: (body) => ({
        url: "teams/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["team"],
    }),

    // READ ALL Team
    getTeams: builder.query<TeamType, { page: number; pageSize: number }>({
      query: ({page, pageSize}) => `teams/?page=${page}&page_size=${pageSize}`,
      providesTags: ["team"],
    }),

    // READ BY ID Team
    getTeamById: builder.query<Team, number | string>({
      query: (id) => `teams/${id}/`,
      providesTags: ["team"],
    }),

    // UPDATE BY ID Team
    updateTeamById: builder.mutation<Team, { id: number | string; data: Partial<Team> } >({
      query: ({ id, data }) => ({
        url: `teams/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),

    // DELETE BY ID Team
    deleteTeamById: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `teams/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["team"],
    }),

    // CREATE Employee 
    addEmployee: builder.mutation<Employee, Partial<Employee>>({
      query: (body) => ({
        url: "users/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["employee"],
    }),

    // READ ALL Employee
    getEmployee: builder.query<EmployeeType, { page: number; pageSize: number }>({
      query: ({ page, pageSize }) => `users/?page=${page}&page_size=${pageSize}`,
      providesTags: ["employee"],
    }),

    // READ BY ID Employee
    getEmployeeById: builder.query<Employee, number | string>({
      query: (id) => `users/${id}/`,
      providesTags: ["employee"],
    }),

    // UPDATE BY ID Employee
    updateEmployeeById: builder.mutation<Employee, { id: number | string; data: Partial<Employee> } >({
      query: ({ id, data }) => ({
        url: `users/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["employee"],
    }),

    // DELETE BY ID Employee
    deleteEmployeeById: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["employee"],
    }),

  }),
});

export const {
  useAddTeamMutation,
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useUpdateTeamByIdMutation,
  useDeleteTeamByIdMutation,

  useAddEmployeeMutation,
  useGetEmployeeQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeByIdMutation,
  useDeleteEmployeeByIdMutation,
} = myTeamApi;
