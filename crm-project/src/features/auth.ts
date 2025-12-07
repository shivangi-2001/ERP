import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TokenResponse } from '../types/auth'

interface AuthState {
  access: string | null
  refresh: string | null
}

const initialState: AuthState = {
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<TokenResponse>) => {
      const { access, refresh } = action.payload
      state.access = access
      state.refresh = refresh
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
    },
    logout: (state) => {
      state.access = null
      state.refresh = null
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
