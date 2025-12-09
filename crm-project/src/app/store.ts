import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth'
import { authApi } from "../service/auth"

import cvssReducer from "../features/cvss"
import assestReducer from "../features/assessment"
import { assessmentApi } from '../service/assessment'

import projectReducer from "../features/project"
import { projectApi } from '../service/project'

import myTeamReducer from "../features/myTeam"
import { myTeamApi } from '../service/myTeam'

export const store = configureStore({
  reducer: {
    assessment: assestReducer,
    cvss: cvssReducer,
    myTeam: myTeamReducer,
    project: projectReducer,
    auth: authReducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [assessmentApi.reducerPath]: assessmentApi.reducer,
    [myTeamApi.reducerPath]: myTeamApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectApi.middleware,
      assessmentApi.middleware,
      myTeamApi.middleware,
      authApi.middleware, 
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
