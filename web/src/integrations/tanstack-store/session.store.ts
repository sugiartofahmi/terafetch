import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'
import type { TUser } from '@/apis/auth/login/login.type'

type TSessionState = {
  user: TUser | null
}

const initialState: TSessionState = {
  user: null,
}

export const sessionStore = new Store<TSessionState>(initialState)

export const sessionActions = {
  setUser: (user: TUser) => sessionStore.setState(() => ({ user })),
  clearUser: () => sessionStore.setState(() => initialState),
}

export const useSessionUser = () =>
  useStore(sessionStore, (state) => state.user)
