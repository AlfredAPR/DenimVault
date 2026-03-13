import { ModelRepository, InventoryRepository } from "@/features/shared/repository";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackageOpen, AlertTriangle, Boxes } from "lucide-react";

export const dynamic = "force-dynamic";

// For MVP, we'll fetch data directly in Server Components
export default async function Dashboard() {
  const models = await ModelRepository.getAll();
  const inventory = await InventoryRepository.getAll();

  const totalModels = models.length;
  const totalStock = inventory.reduce((acc, item) => acc + item.quantity, 0);
  
  // Find low stock items
  const lowStockItems = inventory
    .filter(item => item.quantity <= item.min_threshold)
    .map(item => {
      const model = models.find(m => m.id === item.model_id);
      return {
        ...item,
        modelName: model?.name || "Modelo Desconocido",
        sku: model?.sku || "N/A"
      };
    })
    .sort((a, b) => a.quantity - b.quantity);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Resumen</h2>
        <p className="text-muted-foreground">Gestiona tu catálogo visual y controla el inventario en tiempo real.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modelos</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalModels}</div>
            <p className="text-xs text-muted-foreground">Diseños registrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario Total</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Unidades en stock</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Alertas Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-destructive/80">Requiere maquila inmediata</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prioridad de Producción (Stock Bajo)</CardTitle>
          <CardDescription>Modelos que han alcanzado o están por debajo de su límite mínimo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Talla</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Mínimo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.modelName}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.min_threshold}</TableCell>
                  <TableCell>
                    {item.quantity === 0 ? (
                      <Badge variant="destructive" className="bg-destructive text-destructive-foreground">Sin Stock</Badge>
                    ) : (
                      <Badge variant="outline" className="text-destructive border-destructive">Stock Bajo</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {lowStockItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    ¡Todo bien! Ningún modelo está por debajo del límite.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
