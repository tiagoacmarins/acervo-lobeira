import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface UsuarioAdmin {
  id: string;
  email: string;
  nome: string | null;
  role: string;
  assinaturaAtiva: boolean;
  matriculaAtiva: boolean;
  criadoEm: string;
}

export async function listarUsuariosAdmin(): Promise<UsuarioAdmin[]> {
  const admin = createAdminClient();
  const supabase = await createClient();
  const agora = new Date().toISOString();

  const [{ data: authData }, { data: perfis }, { data: assinaturas }, { data: matriculas }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    supabase.from("profiles").select("id, nome_completo, role"),
    supabase.from("assinaturas").select("user_id").eq("status", "ativa").or(`fim.is.null,fim.gt.${agora}`),
    supabase.from("matriculas_cursos").select("user_id").eq("status", "ativa").or(`fim.is.null,fim.gt.${agora}`),
  ]);

  const perfilPorId = new Map((perfis ?? []).map((p) => [p.id, p]));
  const assinantesAtivos = new Set((assinaturas ?? []).map((a) => a.user_id));
  const alunosAtivos = new Set((matriculas ?? []).map((m) => m.user_id));

  return (authData?.users ?? [])
    .map((u) => ({
      id: u.id,
      email: u.email ?? "(sem e-mail)",
      nome: perfilPorId.get(u.id)?.nome_completo ?? null,
      role: perfilPorId.get(u.id)?.role ?? "usuario",
      assinaturaAtiva: assinantesAtivos.has(u.id),
      matriculaAtiva: alunosAtivos.has(u.id),
      criadoEm: u.created_at,
    }))
    .sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1));
}

export async function buscarIdPorEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const encontrado = data?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return encontrado?.id ?? null;
}
