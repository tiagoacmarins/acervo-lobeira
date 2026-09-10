import { createClient } from "@/lib/supabase/server";

export interface Disciplina {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
}

export async function listarDisciplinas(): Promise<Disciplina[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("disciplinas")
    .select("id,slug,nome,descricao")
    .order("ordem", { ascending: true });

  if (error) {
    console.error("listarDisciplinas:", error.message);
    return [];
  }
  return data ?? [];
}

export async function buscarDisciplinaPorSlug(slug: string): Promise<Disciplina | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("disciplinas")
    .select("id,slug,nome,descricao")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("buscarDisciplinaPorSlug:", error.message);
    return null;
  }
  return data;
}
