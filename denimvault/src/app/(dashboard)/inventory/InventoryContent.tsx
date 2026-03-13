"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateStockQuantityAction } from "@/features/stock/actions";
import { JeanModel } from "@/core/types/models";
import { StockItem } from "@/core/types/inventory";

interface InventoryContentProps {
  initialModels: JeanModel[];
  initialInventory: StockItem[];
}

export default function InventoryContent({ initialModels, initialInventory }: InventoryContentProps) {
  const searchParams = useSearchParams();
  const initialModelId = searchParams.get("model");
  const [inventory, setInventory] = useState(initialInventory);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const executeStockUpdate = async (id: string, newQuantity: number) => {
    setIsUpdating(id);
    const result = await updateStockQuantityAction(id, newQuantity);

    if (!result.success) {
      // Revert on failure
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? initialInventory.find(i => i.id === id) || item : item
        )
      );
    }
    
    setIsUpdating(null);
  };

  const handleAdjustStock = (item: StockItem, delta: number) => {
    const newQuantity = Math.max(0, item.quantity + delta);
    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      )
    );
    executeStockUpdate(item.id, newQuantity);
  };

  const handleInputChange = (id: string, value: string) => {
    let newQuantity = 0;
    if (value !== "") {
      const rawVal = parseInt(value, 10);
      newQuantity = isNaN(rawVal) ? 0 : Math.max(0, rawVal);
    }
    
    setInventory((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  const handleInputBlur = (id: string, quantity: number) => {
    executeStockUpdate(id, quantity);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Matriz de Stock</h2>
          <p className="text-muted-foreground">Ajusta rápidamente los niveles de inventario desde el taller.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filtrar por SKU o nombre..." className="pl-8 bg-background" />
        </div>
      </div>

      <div className="space-y-8">
        {initialModels.map((model) => {
          const modelStock = inventory.filter((item) => item.model_id === model.id);
          // Sort by size logically if they are numeric
          modelStock.sort((a,b) => parseInt(a.size) - parseInt(b.size));
          if (modelStock.length === 0) return null;

          return (
            <Card key={model.id} className={initialModelId === model.id ? "ring-2 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={model.image_url || ""} alt={model.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">{model.sku} &bull; {model.fit_type}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Talla</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Stock / Ajustar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modelStock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-base">{item.size}</TableCell>
                        <TableCell>
                          {item.quantity === 0 ? (
                            <Badge variant="destructive" className="bg-destructive text-destructive-foreground hover:bg-destructive">Sin Stock</Badge>
                          ) : item.quantity <= item.min_threshold ? (
                            <Badge variant="outline" className="text-destructive border-destructive">Stock Bajo</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">En Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleAdjustStock(item, -1)}
                              disabled={item.quantity === 0 || isUpdating === item.id}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            
                            <Input 
                              type="number" 
                              min="0"
                              value={item.quantity.toString()} 
                              onChange={(e) => handleInputChange(item.id, e.target.value)}
                              onBlur={() => handleInputBlur(item.id, item.quantity)}
                              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                              className="w-20 text-center font-bold font-mono h-8 no-spinners"
                              disabled={isUpdating === item.id}
                            />

                            <Button
                              variant="default"
                              size="icon"
                              className="h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() => handleAdjustStock(item, 1)}
                              disabled={isUpdating === item.id}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
        {initialModels.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No hay modelos en el inventario. Añade modelos desde el catálogo.
          </div>
        )}
      </div>
    </div>
  );
}
