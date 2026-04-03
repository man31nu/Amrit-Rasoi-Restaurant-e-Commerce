import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '../services/api'

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  token: string
  phone?: string
  address?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

// Hydrate from localStorage for persistence
const storedUser = localStorage.getItem('rxUser')
const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  loading: false,
  error: null,
}

// ── Thunks ──────────────────────────────────────────────────
export const signup = createAsyncThunk(
  'auth/signup',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<User>('/auth/signup', data)
      return res.data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message ?? 'Signup failed')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<User>('/auth/login', data)
      return res.data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message ?? 'Login failed')
    }
  }
)

// ── Slice ────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.error = null
      localStorage.removeItem('rxUser')
    },
    clearError(state) {
      state.error = null
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('rxUser', JSON.stringify(state.user))
      }
    },
  },
  extraReducers: (builder) => {
    // signup
    builder
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null })
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        localStorage.setItem('rxUser', JSON.stringify(action.payload))
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    // login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        localStorage.setItem('rxUser', JSON.stringify(action.payload))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, updateUser } = authSlice.actions
export default authSlice.reducer
