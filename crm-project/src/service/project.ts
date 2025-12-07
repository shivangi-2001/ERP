import { createApi } from "@reduxjs/toolkit/query/react";
import baseAuthHeader from "./baseAuthHeader";
import { ClientDetails, ClientDetail, ClientTeam } from "../types/project";

export const projectApi = createApi({
    reducerPath: "projectApi",
    baseQuery: baseAuthHeader,
    tagTypes: ["client", "teams"],
    endpoints: (builder) => ({
        getClientDetails: builder.query<ClientDetails, { next: number } | void>({
            query: (params) => {
                if (params && 'page' in params) {
                    return `/client/details/?page=${params.page}`;
                }
                return "/client/details/";
            },
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

    useCreateClientTeamMutation,
    useEditClientTeamMutation,
    useDeleteClientTeamMutation
} = projectApi;