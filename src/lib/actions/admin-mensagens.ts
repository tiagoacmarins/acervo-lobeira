"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { exigirAdminOuEditor } from "@/lib/admin/guard";

export async function marcarMensagemRespondidaAction(formData: FormData) {
  await exigirAdminOuEditor();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("mensagens_contato").update({ respondido: true }).eq("id", id);
  revalidatePath("/admin/mensagens");
}
