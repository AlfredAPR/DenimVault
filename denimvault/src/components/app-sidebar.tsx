import { Calendar, Home, Inbox, Search, Settings, Shirt, Package, LayoutDashboard, LogOut } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Panel de Control",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Catálogo Visual",
    url: "/catalog",
    icon: Shirt,
  },
  {
    title: "Matriz de Stock",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Ajustes",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-4 py-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Shirt className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">DenimVault</span>
          </div>
          <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
