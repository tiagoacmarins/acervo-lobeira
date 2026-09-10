import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface MaterialResumo {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  resumo: string | null;
  tipo: string;
  regra_acesso: string;
  capa_url: string | null;
  publicado_em: string | null;
  visualizacoes_count: number;
  is_demo: boolean;
  disciplina: { slug: string; nome: string } | null;
}

export interface MaterialCompleto extends MaterialResumo {
  especie: string | null;
  downloads_count: number;
  autor: { nome: string } | null;
}

const SELECT_RESUMO =
  "id,slug,titulo,subtitulo,resumo,tipo,regra_acesso,capa_url,publicado_em,visualizacoes_count,is_demo,disciplina:disciplinas(slug,nome)";

export async function listarMateriais(opts: {
  q?: string;
  disciplinaId?: string;
  tipo?: string;
  limit?: number;
  ordenarPor?: "recentes" | "acessados";
} = {}): Promise<MaterialResumo[]> {
  const supabase = await createClient();
  let query = supabase.from("materiais").select(SELECT_RESUMO).eq("status", "publicado");

  if (opts.disciplinaId) query = query.eq("disciplina_id", opts.disciplinaId);
  if (opts.tipo) query = query.eq("tipo", opts.tipo);
  if (opts.q && opts.q.trim()) {
    query = query.textSearch("busca", opts.q.trim(), { type: "websearch", config: "portuguese" });
  }

  query =
    opts.ordenarPor === "acessados"
      ? query.order("visualizacoes_count", { ascending: false })
      : query.order("publicado_em", { ascending: false, nullsFirst: false });

  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) {
    console.error("listarMateriais:", error.message);
    return [];
  }
  return (data ?? []) as unknown as MaterialResumo[];
}

export async function buscarMaterialPorSlug(slug: string): Promise<MaterialCompleto | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materiais")
    .select(
      "id,slug,titulo,subtitulo,resumo,tipo,especie,regra_acesso,capa_url,publicado_em,visualizacoes_count,downloads_count,is_demo,disciplina:disciplinas(slug,nome),autor:autores(nome)",
    )
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();

  if (error) {
    console.error("buscarMaterialPorSlug:", error.message);
    return null;
  }
  return data as unknown as MaterialCompleto | null;
}

/**
 * Só pra decidir o que mostrar na tela (qual botão exibir). A
 * segurança de verdade é sempre reconferida dentro da rota de
 * download, então não tem problema esta checagem aqui ser "só de UI".
 */
export async function materialTemArquivo(materialId: string, tipo: "pdf" | "preview"): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin.from("arquivos").select("id").eq("material_id", materialId).eq("tipo", tipo).maybeSingle();
  return !!data;
}

/** Registra 1 visualização. O contador em "materiais" sobe sozinho (gatilho no banco). */
export async function registrarVisualizacaoMaterial(materialId: string) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  await supabase.from("visualizacoes").insert({ material_id: materialId, user_id: auth.user?.id ?? null });
}
