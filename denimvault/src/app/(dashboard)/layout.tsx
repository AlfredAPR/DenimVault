import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex w-full flex-col">
        <div className="flex items-center p-4 border-b bg-background">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-xl font-semibold opacity-80">DenimVault Admin</h1>
        </div>
        <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900 border-l lg:border-none relative">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
