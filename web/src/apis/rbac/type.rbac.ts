export const PERMISSION_CODES = {
  DASHBOARD_VIEW: 'dashboard:view',
} as const

export type TPermissionCode =
  (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES]
