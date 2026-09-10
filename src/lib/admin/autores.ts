import type { SupabaseClient } from "@supabase/supabase-js";

/** Acha um autor pelo nome (sem diferenciar maiúsculas) ou cria um novo. */
export async function buscarOuCriarAutor(supabase: SupabaseClient, nome: string): Promise<string | null> {
  const nomeLimpo = nome.trim();
  if (!nomeLimpo) return null;

  const { data: existente } = await supabase
    .from("autores")
    .select("id")
    .ilike("nome", nomeLimpo)
    .maybeSingle();
  if (existente) return existente.id;

  const { data: novo } = await supabase.from("autores").insert({ nome: nomeLimpo }).select("id").single();
  return novo?.id ?? null;
}
