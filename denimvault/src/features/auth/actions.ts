"use server";

import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/core/errors";
import { createClient } from "@/core/lib/supabase/server";

export async function loginAction(formData: FormData): Promise<ActionResponse<null>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: { message: "Email and password are required" } };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    return { success: false, error: { message: "Credenciales inválidas" } };
  }

  // Auth successful
  revalidatePath("/", "layout");
  return { success: true, data: null };
}

export async function logoutAction(): Promise<ActionResponse<null>> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  return { success: true, data: null };
}
