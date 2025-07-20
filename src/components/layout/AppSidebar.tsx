import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp, Home, FileText } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
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
  SidebarRail,
} from '@/components/ui/sidebar'

const menuItems = [
  {
    title: 'Обзор',
    url: '/',
    icon: Home,
  },
  {
    title: 'Аналитика продаж',
    url: '/sales',
    icon: TrendingUp,
  },
  {
    title: 'Финансовые отчеты',
    url: '/financial',
    icon: FileText,
  },
  {
    title: 'Товары',
    url: '/products',
    icon: Package,
  },
  {
    title: 'Склад',
    url: '/inventory',
    icon: ShoppingCart,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Ozon Analytics</span>
            <span className="truncate text-xs text-muted-foreground">Финансовая панель</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
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
        <div className="p-4 text-xs text-muted-foreground">
          © 2024 Ozon Financial Dashboard
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}