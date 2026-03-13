import Image from "next/image";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ModelRepository } from "@/features/shared/repository";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const models = await ModelRepository.getAll();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Catálogo Visual</h2>
          <p className="text-muted-foreground">Gestiona tus diseños de jeans y especificaciones.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/catalog/new">
            <Plus className="h-4 w-4" />
            Nuevo Modelo
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2 w-full max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por SKU o nombre..."
            className="pl-8 bg-background"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={model.image_url || ""}
                alt={model.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
                  {model.fit_type}
                </Badge>
              </div>
            </div>
            <CardHeader className="p-4 pb-0">
              <h3 className="font-semibold text-lg line-clamp-1">{model.name}</h3>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground font-mono">{model.sku}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/inventory?model=${model.id}`}>
                  Ver Inventario
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {models.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No hay modelos registrados. Añade uno nuevo para comenzar.
          </div>
        )}
      </div>
    </div>
  );
}
