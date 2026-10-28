import type { TPermissionCode } from '@/apis/rbac/type.rbac'
import {
  permissionActions,
  usePermissionStore,
} from '@/integrations/tanstack-store/permission.store'
import { PERMISSION_CODES } from '@/apis/rbac/type.rbac'

export const usePermission = () => {
  const { userPermissions, userRole, isOwner } = usePermissionStore()

  const hasPermission = (permission: TPermissionCode): boolean => {
    if (isOwner) return true
    if (userRole === 'admin') return true

    return userPermissions.some((p) => {
      if (p === '*') return true
      if (p === permission) return true
      if (p.endsWith(':*')) return permission.startsWith(p.slice(0, -2))
      return false
    })
  }

  const hasAnyPermission = (permissions: Array<TPermissionCode>): boolean =>
    permissions.some((p) => hasPermission(p))

  const hasAllPermissions = (permissions: Array<TPermissionCode>): boolean =>
    permissions.every((p) => hasPermission(p))

  const can = {
    viewDashboard: () => hasPermission(PERMISSION_CODES.DASHBOARD_VIEW),
  }

  return {
    userPermissions,
    userRole,
    isOwner,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
    setPermissions: permissionActions.setPermissions,
    clearPermissions: permissionActions.clearPermissions,
  }
}
