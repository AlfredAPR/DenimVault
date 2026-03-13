"use client";

import { useState } from "react";
import { loginAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageOpen } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    const response = await loginAction(formData);
    
    if (!response.success) {
      setError(response.error?.message || "Ocurrió un error inesperado.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="w-full">
          <CardHeader className="space-y-1 items-center pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
              <PackageOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-center">DenimVault Admin</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al inventario
            </CardDescription>
          </CardHeader>
          <form action={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="admin@denimvault.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                />
              </div>
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Ingresar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
