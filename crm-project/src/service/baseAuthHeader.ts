import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../app/store";
import { setCredentials, logout } from "../features/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseAuthHeader: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async ( args, api, extraOptions ) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refresh;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/token/refresh/",
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccess = (refreshResult.data as any).access;
      api.dispatch(setCredentials({ access: newAccess, refresh: refreshToken }));
      // retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export default baseAuthHeader;
