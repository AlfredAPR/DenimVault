"use client";

import Link from "next/link";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createModelAction } from "@/features/catalog/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewModelPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    const response = await createModelAction(formData);
    
    if (response.success) {
      router.push("/catalog");
    } else {
      setError(response.error?.message || "Ocurrió un error desconocido.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/catalog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Nuevo Modelo</h2>
          <p className="text-muted-foreground">Añade un nuevo diseño de jean a tu catálogo.</p>
        </div>
      </div>

      <Card>
        <form action={handleSubmit}>
          <CardHeader>
            <CardTitle>Detalles del Modelo</CardTitle>
            <CardDescription>Ingresa las especificaciones del nuevo modelo de denim.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" required placeholder="ej. SLIM-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fit">Tipo de Corte</Label>
                <Input id="fit" name="fit" required placeholder="ej. Slim, Mom, Skinny..." />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Modelo</Label>
              <Input id="name" name="name" required placeholder="ej. Slim Azul Clásico" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen del Modelo</Label>
              <Input 
                id="image" 
                name="image" 
                type="file" 
                accept="image/*" 
                className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 h-12 pt-2.5" 
              />
              <p className="text-xs text-muted-foreground">Sube un archivo PNG, JPG o WEBP.</p>
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="ghost" asChild disabled={isSubmitting}>
              <Link href="/catalog">Cancelar</Link>
            </Button>
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? "Guardando..." : "Guardar Modelo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
