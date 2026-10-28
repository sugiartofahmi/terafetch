import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'
import type { TPermissionCode } from '@/apis/rbac/type.rbac'

type TPermissionState = {
  userPermissions: Array<string>
  userRole: string | null
  isOwner: boolean
}

const initialState: TPermissionState = {
  userPermissions: [],
  userRole: null,
  isOwner: false,
}

export const permissionStore = new Store<TPermissionState>(initialState)

export const permissionActions = {
  setPermissions: (
    permissions: Array<string>,
    role: string | null,
    isOwner: boolean,
  ) => {
    permissionStore.setState(() => ({
      userPermissions: permissions,
      userRole: role,
      isOwner,
    }))
  },

  clearPermissions: () => {
    permissionStore.setState(() => initialState)
  },

  hasPermission: (permission: TPermissionCode): boolean => {
    const state = permissionStore.state
    if (state.isOwner) return true
    if (state.userRole === 'admin') return true

    return state.userPermissions.some((p) => {
      if (p === '*') return true
      if (p === permission) return true
      if (p.endsWith(':*')) return permission.startsWith(p.slice(0, -2))
      return false
    })
  },
}

export const usePermissionStore = () => useStore(permissionStore)
