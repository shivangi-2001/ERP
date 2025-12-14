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

import pentestReducer from '../features/pentest'
import { pentestApi } from '../service/pentest'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    
    cvss: cvssReducer,
    assessment: assestReducer,
    
    project: projectReducer,
    
    myTeam: myTeamReducer,

    pentest: pentestReducer,
    
    [authApi.reducerPath]: authApi.reducer,
    [assessmentApi.reducerPath]: assessmentApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [myTeamApi.reducerPath]: myTeamApi.reducer,
    [pentestApi.reducerPath]: pentestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      assessmentApi.middleware,
      projectApi.middleware,
      myTeamApi.middleware,
      pentestApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
