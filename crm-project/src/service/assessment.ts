import { createApi } from "@reduxjs/toolkit/query/react";
import baseAuthHeader from "./baseAuthHeader";
import { Assessment, AssessmentType, Team, TeamType, Vulnerability, VulnerabilityType, Employee, EmployeeType, Compliance, ComplianceType } from "../types/assessment";

export const assessmentApi = createApi({
  reducerPath: "assessmentApi",
  baseQuery: baseAuthHeader,
  tagTypes: ["Assessment", "vulnerabilities","Compliance", "team", "employee"],
  endpoints: (builder) => ({
    // CREATE ASSESSMENT TYPE
    addAssessment: builder.mutation<Assessment, Partial<Assessment>>({
      query: (body) => ({
        url: "assessments/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assessment"],
    }),

    // READ ALL ASSESSMENT TYPE
    getAssessments: builder.query<AssessmentType, { page: number; pageSize: number }>({
      query: ({page, pageSize}) => `assessments/?page=${page}&page_size=${pageSize}`,
      providesTags: ["Assessment"],
    }),

    // READ BY ID ASSESSMENT TYPE
    getAssessmentById: builder.query<Assessment, number | string>({
      query: (id) => `assessments/${id}/`,
      providesTags: ["Assessment"],
    }),

    // UPDATE BY ID ASSESSMENT TYPE
    updateAssessmentById: builder.mutation< Assessment, { id: number | string; data: Partial<Assessment> } >({
      query: ({ id, data }) => ({
        url: `assessments/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Assessment"],
    }),

    // DELETE BY ID ASSESSMENT TYPE
    deleteAssessmentById: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `assessments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assessment"],
    }),

    // CREATE VULNER
    addVulnerability: builder.mutation<Vulnerability, Partial<Vulnerability>>({
      query: (body) => ({
        url: "vulnerabilities/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["vulnerabilities"],
    }),

    // READ ALL VULNER
    getVulnerabilities: builder.query<VulnerabilityType, { page: number; pageSize: number }>({
      query: ({page, pageSize}) => `vulnerabilities/?page=${page}&page_size=${pageSize}`,
      providesTags: ["vulnerabilities"],
    }),

    // READ BY ID VULNER
    getVulnerabilityById: builder.query<Vulnerability, number | string>({
      query: (id) => `vulnerabilities/${id}/`,
      providesTags: ["vulnerabilities"],
    }),

    // UPDATE BY ID ASSESSMENT TYPE
    updateVulnerabilityById: builder.mutation<Vulnerability, { id: number | string; data: Partial<Vulnerability> } >({
      query: ({ id, data }) => ({
        url: `vulnerabilities/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["vulnerabilities"],
    }),

    // DELETE BY ID ASSESSMENT TYPE
    deleteVulnerabilityById: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `vulnerabilities/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["vulnerabilities"],
    }),


    // CREATE Compliance TYPE
    addCompliance: builder.mutation<Compliance, Partial<Assessment>>({
          query: (body) => ({
            url: "compliance/",
            method: "POST",
            body,
          }),
          invalidatesTags: ["Compliance"],
    }),
    
    // READ ALL Compliance TYPE
    getCompliance: builder.query<ComplianceType, { page: number; pageSize: number }>({
      query: ({page, pageSize}) => `compliance/?page=${page}&page_size=${pageSize}`,
      providesTags: ["Compliance"],
    }),
    
    // READ BY ID Compliance TYPE
    getComplianceById: builder.query<Compliance, number | string>({
      query: (id) => `compliance/${id}/`,
      providesTags: ["Compliance"],
    }),
    
    // UPDATE BY ID Compliance TYPE
    updateComplianceById: builder.mutation< Compliance, { id: number | string; data: Partial<Compliance> } >({
      query: ({ id, data }) => ({
        url: `compliance/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Compliance"],
    }),
    
    // DELETE BY ID Compliance TYPE
    deleteComplianceById: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `compliance/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Compliance"],
    }),


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
  useAddAssessmentMutation,
  useGetAssessmentsQuery,
  useGetAssessmentByIdQuery,
  useUpdateAssessmentByIdMutation,
  useDeleteAssessmentByIdMutation,

  useAddVulnerabilityMutation,
  useGetVulnerabilitiesQuery,
  useGetVulnerabilityByIdQuery,
  useUpdateVulnerabilityByIdMutation,
  useDeleteVulnerabilityByIdMutation,

  useAddComplianceMutation,
  useGetComplianceQuery,
  useGetComplianceByIdQuery,
  useUpdateComplianceByIdMutation,
  useDeleteComplianceByIdMutation,

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
} = assessmentApi;
