"use server";

import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/core/errors";
import { JeanModel } from "@/core/types/models";
import { ModelRepository, InventoryRepository } from "@/features/shared/repository";
import { supabase } from "@/core/lib/supabase";

export async function createModelAction(
  formData: FormData
): Promise<ActionResponse<JeanModel>> {
  try {
    const sku = formData.get("sku") as string;
    const name = formData.get("name") as string;
    const fit_type = formData.get("fit") as string;
    
    // Basic validation
    if (!sku || !name || !fit_type) {
      return {
        success: false,
        error: { message: "SKU, Nombre y Tipo de Corte son obligatorios." },
      };
    }

    const imageFile = formData.get("image") as File | null;
    
    // Default image if no upload is provided
    let image_url = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600";
    
    // Handle specific file upload if present
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop() || "jpg";
      const fileName = `${sku}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('models')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error("Error al subir la imagen a Supabase Storage: " + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage.from('models').getPublicUrl(filePath);
      image_url = publicUrl;
    }

    const newModel = await ModelRepository.create({
      sku,
      name,
      fit_type,
      image_url,
    });

    // Automatically create initial inventory records for this model (sizes 28,30,32,36)
    await InventoryRepository.createInitialStockForModel(newModel.id!);

    revalidatePath("/catalog");
    revalidatePath("/inventory");
    revalidatePath("/");
    
    return { success: true, data: newModel };
  } catch (error: any) {
    console.error("Error creating model:", error);
    // Generic error handling
    return {
      success: false,
      error: { message: "Hubo un error al crear el modelo. Verifica que el SKU no esté duplicado." },
    };
  }
}
