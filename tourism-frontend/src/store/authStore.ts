import { create } from 'zustand'

export interface User {
  id: number | string
  username: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN' | 'TOURIST' | 'TOUR_OPERATOR'
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User, token: string) => void
  login: (token: string, user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user, token) => set({ user, token }),
  login: (token, user) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
