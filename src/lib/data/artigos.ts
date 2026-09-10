import { createClient } from "@/lib/supabase/server";

export interface ArtigoResumo {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  pre_resumo: string | null;
  capa_url: string | null;
  publicado_em: string | null;
  visualizacoes_count: number;
  is_demo: boolean;
  disciplina: { slug: string; nome: string } | null;
}

export interface ArtigoCompleto extends ArtigoResumo {
  resumo: string | null;
  fonte: string | null;
  url_original: string | null;
  autor: { nome: string } | null;
}

const SELECT_RESUMO =
  "id,slug,titulo,subtitulo,pre_resumo,capa_url,publicado_em,visualizacoes_count,is_demo,disciplina:disciplinas(slug,nome)";

export async function listarArtigos(opts: {
  q?: string;
  disciplinaId?: string;
  limit?: number;
} = {}): Promise<ArtigoResumo[]> {
  const supabase = await createClient();
  let query = supabase.from("artigos").select(SELECT_RESUMO).eq("status", "publicado");

  if (opts.disciplinaId) query = query.eq("disciplina_id", opts.disciplinaId);
  if (opts.q && opts.q.trim()) {
    query = query.textSearch("busca", opts.q.trim(), { type: "websearch", config: "portuguese" });
  }

  query = query.order("publicado_em", { ascending: false, nullsFirst: false });
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) {
    console.error("listarArtigos:", error.message);
    return [];
  }
  return (data ?? []) as unknown as ArtigoResumo[];
}

export async function buscarArtigoPorSlug(slug: string): Promise<ArtigoCompleto | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artigos")
    .select(
      "id,slug,titulo,subtitulo,pre_resumo,resumo,fonte,url_original,capa_url,publicado_em,visualizacoes_count,is_demo,disciplina:disciplinas(slug,nome),autor:autores(nome)",
    )
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();

  if (error) {
    console.error("buscarArtigoPorSlug:", error.message);
    return null;
  }
  return data as unknown as ArtigoCompleto | null;
}

export async function registrarVisualizacaoArtigo(artigoId: string) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  await supabase.from("visualizacoes").insert({ artigo_id: artigoId, user_id: auth.user?.id ?? null });
}
