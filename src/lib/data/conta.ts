import { createClient } from "@/lib/supabase/server";

export interface AssinaturaAtiva {
  id: string;
  status: string;
  inicio: string;
  fim: string | null;
  plano: { nome: string; preco_centavos: number } | null;
}

export async function buscarAssinaturaAtiva(userId: string): Promise<AssinaturaAtiva | null> {
  const supabase = await createClient();
  const agora = new Date().toISOString();
  const { data } = await supabase
    .from("assinaturas")
    .select("id, status, inicio, fim, plano:planos(nome, preco_centavos)")
    .eq("user_id", userId)
    .eq("status", "ativa")
    .or(`fim.is.null,fim.gt.${agora}`)
    .order("inicio", { ascending: false })
    .maybeSingle();
  return data as unknown as AssinaturaAtiva | null;
}

export interface MatriculaAtiva {
  id: string;
  status: string;
  inicio: string;
  fim: string | null;
  produto: { nome: string } | null;
}

export async function buscarMatriculaAtiva(userId: string): Promise<MatriculaAtiva | null> {
  const supabase = await createClient();
  const agora = new Date().toISOString();
  const { data } = await supabase
    .from("matriculas_cursos")
    .select("id, status, inicio, fim, produto:produtos_elegiveis(nome)")
    .eq("user_id", userId)
    .eq("status", "ativa")
    .or(`fim.is.null,fim.gt.${agora}`)
    .order("inicio", { ascending: false })
    .maybeSingle();
  return data as unknown as MatriculaAtiva | null;
}

export interface FavoritoItem {
  id: string;
  criado_em: string;
  material: { slug: string; titulo: string } | null;
  artigo: { slug: string; titulo: string } | null;
}

export async function listarFavoritos(userId: string): Promise<FavoritoItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favoritos")
    .select("id, created_at, material:materiais(slug,titulo), artigo:artigos(slug,titulo)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listarFavoritos:", error.message);
    return [];
  }
  return (data ?? []).map((f) => ({
    id: f.id,
    criado_em: f.created_at,
    material: f.material as unknown as FavoritoItem["material"],
    artigo: f.artigo as unknown as FavoritoItem["artigo"],
  }));
}

export interface HistoricoItem {
  id: string;
  visto_em: string;
  material: { slug: string; titulo: string } | null;
  artigo: { slug: string; titulo: string } | null;
}

export async function listarHistorico(userId: string, limite = 10): Promise<HistoricoItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("historico")
    .select("id, visto_em, material:materiais(slug,titulo), artigo:artigos(slug,titulo)")
    .eq("user_id", userId)
    .order("visto_em", { ascending: false })
    .limit(limite);

  if (error) {
    console.error("listarHistorico:", error.message);
    return [];
  }
  return (data ?? []) as unknown as HistoricoItem[];
}
