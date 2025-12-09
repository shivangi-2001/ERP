import { createApi } from "@reduxjs/toolkit/query/react";
import baseAuthHeader from "./baseAuthHeader";
import { ClientDetails, ClientDetail, ClientTeam, ClientAssessment, ClientAssessmentType, UrlMapping, UrlMappingType, FindingType } from "../types/project";

export const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: baseAuthHeader,
    tagTypes: ["client", "teams", "url"],
    endpoints: (builder) => ({
        getClientDetails: builder.query<ClientDetails,  { page: number; pageSize: number }>({
            query: ({page, pageSize}) => `/client/details/?page=${page}&page_size=${pageSize}`,
            providesTags: ["client"],
        }),

        createClientDetail: builder.mutation<ClientDetail, Partial<ClientDetail>>({
            query: (body) => ({
                url: "/client/details/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["client"],
        }),

        getClientDetail: builder.query<ClientDetail, string | number | undefined>({
            query: (id) => `/client/details/${id}/`,
            providesTags: ["client"],
        }),

        editClientDetail: builder.mutation<ClientDetail, { id: string | number; body: Partial<ClientDetail> }>({
            query: ({ id, body }) => ({
                url: `/client/details/${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["client"],
        }),

        deleteClientDetail: builder.mutation<void, string | number>({
            query: (id) => ({
                url: `/client/details/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["client"],
        }),



        getClientTeamByClientId: builder.query<ClientDetails, {id: number, page: number; pageSize: number}>({
            query: ({id, page, pageSize}) => `/client/teams/${id}?page=${page}&pageSize=${pageSize}`,
            providesTags: ["client"],
        }),

        createClientTeam: builder.mutation<ClientTeam, Partial<ClientTeam>>({
            query: (body) => ({
                url: "/client/teams/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["teams"],
        }),

        editClientTeam: builder.mutation<ClientTeam, { id: string | number; body: Partial<ClientTeam>}>({
            query: ({ id, body }) => ({
                url: `/client/teams/${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["teams"],
        }),

        deleteClientTeam: builder.mutation<void, string | number>({
            query: (id) => ({
                url: `/client/teams/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["teams"],
        }),



        getClientAssessmentType: builder.query<ClientAssessmentType, {client_id: number, assessment_type: string|null, page: number, pageSize: number}>({
            query:({client_id, assessment_type, page, pageSize}) => `/client/assessment?client=${client_id}&assessment_type=${assessment_type}&page=${page}&page_size=${pageSize}`,
            providesTags: ["client"]
        }),

        createClientAssessmentType: builder.mutation<ClientAssessment, Partial<ClientAssessment>>({
            query:(body) => ({
                url: `/client/assessment/`,
                method: 'POST',
                body
            }),
            invalidatesTags: ["client"]
        }),

        editClientAssessmentType: builder.mutation<ClientAssessment, {id: number, body: Partial<ClientAssessment>}>({
            query:({id, body}) => ({
                url: `/client/assessment/${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ["client"]
        }),

        deleteClientAssessmentType: builder.mutation<void, string | number>({
            query: (id) => ({
                url: `/client/assessment/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["client"],
        }),



        getUrlMapping: builder.query<UrlMappingType, {client_id:number|undefined, assessment_type:string|null,page: number; pageSize: number}>({
            query: ({client_id, assessment_type, page, pageSize}) => `/client/url/?client_id=${client_id}&assessment_type=${assessment_type}&page=${page}&page_size=${pageSize}`,
            providesTags: ["url"],
        }),

        createUrlMapping: builder.mutation<UrlMapping, Partial<UrlMapping>>({
            query: (body) => ({
                url: "/client/url/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["url"],
        }),

        getUrlMappingByID: builder.query<UrlMapping, { id: number }>({
            query: ({id}) => `/client/url/${id}/`,
            providesTags: ["url"],
        }),

        editUrlMappingByID: builder.mutation<UrlMapping, {id: number, body: Partial<UrlMapping>}>({
            query: ({id, body}) => ({
                url: `/client/url/${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["url"],
        }),



        getInProgressProject: builder.query<UrlMappingType, void>({
            query: () => `/client/in-progress`
        }),

        getFindingsByProjectID: builder.query<FindingType, {project_id:number, page: number, pageSize: number}>({
            query:({project_id, page, pageSize}) => `/client/findings/?project_id=${project_id}&page=${page}&pageSize=${pageSize}`
        })
    })
});

export const { 
    useGetClientDetailsQuery, 
    useCreateClientDetailMutation,
    useGetClientDetailQuery,
    useEditClientDetailMutation,
    useDeleteClientDetailMutation,

    useGetClientTeamByClientIdQuery,
    useCreateClientTeamMutation,
    useEditClientTeamMutation,
    useDeleteClientTeamMutation,

    useGetClientAssessmentTypeQuery,
    useCreateClientAssessmentTypeMutation,
    useEditClientAssessmentTypeMutation,
    useDeleteClientAssessmentTypeMutation,

    useGetUrlMappingQuery,
    useCreateUrlMappingMutation,
    useGetUrlMappingByIDQuery,
    useEditUrlMappingByIDMutation,

    useGetInProgressProjectQuery,

    useGetFindingsByProjectIDQuery,
} = projectApi;