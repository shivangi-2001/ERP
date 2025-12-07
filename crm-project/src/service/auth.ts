import { createApi } from '@reduxjs/toolkit/query/react'
import type { LoginRequest, TokenResponse, UserProfile } from '../types/auth'
import baseAuthHeader from './baseAuthHeader'


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseAuthHeader,
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/token/',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => 'profile/',
    }),
  }),
})

export const { useLoginMutation, useGetProfileQuery } = authApi
