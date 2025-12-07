import { configureStore } from '@reduxjs/toolkit'
import { authApi } from "../service/auth"
import { assessmentApi } from '../service/assessment'
import authReducer from '../features/auth'
import assestReducer from "../features/assessment"
import projectReducer from "../features/project"
import myTeamReducer from "../features/myTeam"
import { projectApi } from '../service/project'
import { myTeamApi } from '../service/myTeam'

export const store = configureStore({
  reducer: {
    myTeam: myTeamReducer,
    project: projectReducer,
    assessment: assestReducer,
    
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
