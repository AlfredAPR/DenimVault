"use server";

import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/core/errors";
import { StockItem } from "@/core/types/inventory";
import { InventoryRepository } from "@/features/shared/repository";

export async function updateStockQuantityAction(
  itemId: string,
  newQuantity: number
): Promise<ActionResponse<StockItem>> {
  try {
    if (newQuantity < 0) {
      return {
        success: false,
        error: { message: "La cantidad no puede ser negativa." }
      };
    }

    const updatedItem = await InventoryRepository.updateQuantity(itemId, newQuantity);

    revalidatePath("/inventory");
    revalidatePath("/"); // Update dashboard low stock metrics

    return { success: true, data: updatedItem };
  } catch (error: any) {
    console.error("Error updating stock:", error);
    return {
      success: false,
      error: { message: "No se pudo actualizar el inventario." }
    };
  }
}
