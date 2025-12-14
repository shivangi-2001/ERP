import { createApi } from "@reduxjs/toolkit/query/react";
import baseAuthHeader from "./baseAuthHeader";
import { ClientDetails, ClientDetail, ClientTeam } from "../types/project";

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
} = projectApi;