import type { SupabaseClient } from "@supabase/supabase-js";

export async function gerarSlugUnico(
  supabase: SupabaseClient,
  tabela: "materiais" | "artigos" | "disciplinas",
  base: string,
): Promise<string> {
  const raiz = slugify(base) || "item";
  let candidato = raiz;
  let sufixo = 2;
  // Poucas linhas, poucas voltas — não precisa de nada mais elaborado.
  for (let tentativas = 0; tentativas < 50; tentativas++) {
    const { data } = await supabase.from(tabela).select("id").eq("slug", candidato).maybeSingle();
    if (!data) return candidato;
    candidato = `${raiz}-${sufixo}`;
    sufixo++;
  }
  return `${raiz}-${Date.now()}`;
}

export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos (marcas de combinação, após normalize NFD)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
