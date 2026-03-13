import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DenimVault - Sistema de Inventario",
  description: "Catálogo Visual y Matriz de Stock para Productores de Denim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex w-full flex-col">
              <div className="flex items-center p-4 border-b bg-background">
                <SidebarTrigger className="mr-4" />
                <h1 className="text-xl font-semibold opacity-80">DenimVault Admin</h1>
              </div>
              <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900 border-l lg:border-none">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
