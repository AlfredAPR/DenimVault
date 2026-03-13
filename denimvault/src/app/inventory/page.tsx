import { Suspense } from "react";
import InventoryContent from "./InventoryContent"; // We'll extract this to a separate file
import { ModelRepository, InventoryRepository } from "@/features/shared/repository";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const models = await ModelRepository.getAll();
  const inventory = await InventoryRepository.getAll();

  return (
    <Suspense fallback={<div>Cargando matriz de stock...</div>}>
      <InventoryContent initialModels={models} initialInventory={inventory} />
    </Suspense>
  );
}
