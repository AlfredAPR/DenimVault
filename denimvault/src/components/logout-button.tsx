"use client";

import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { logoutAction } from "@/features/auth/actions";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      <span>Cerrar Sesión</span>
    </SidebarMenuButton>
  );
}
