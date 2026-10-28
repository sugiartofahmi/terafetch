import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  sessionActions,
  useSessionUser,
} from '@/integrations/tanstack-store/session.store'
import { cookies } from '@/libs/cookies'
import { usePermission } from '@/middlewares/permission'
import { PERMISSION_CODES } from '@/apis/rbac/type.rbac'

const navItems = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    permission: PERMISSION_CODES.DASHBOARD_VIEW,
  },
]

export const AppSidebar = () => {
  const navigate = useNavigate()
  const user = useSessionUser()
  const { hasPermission, clearPermissions } = usePermission()

  const handleLogout = () => {
    cookies.clearAccessToken()
    sessionActions.clearUser()
    clearPermissions()
    navigate({ to: '/auth/login' })
  }

  const visibleNavItems = navItems.filter((item) =>
    hasPermission(item.permission),
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="truncate px-2 text-sm font-semibold">MNFS.DEV</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-1">
          <span className="truncate text-sm text-muted-foreground">
            {user?.name ?? user?.email ?? 'Account'}
          </span>
          <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
