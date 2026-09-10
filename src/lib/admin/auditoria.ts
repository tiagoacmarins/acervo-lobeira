import { createClient } from "@/lib/supabase/server";

/**
 * Registra uma ação administrativa. Nunca deve derrubar a ação
 * principal se falhar — por isso o try/catch. É só o "livro de
 * registro", não uma trava de segurança (a segurança de verdade está
 * nas policies de RLS).
 */
export async function registrarAuditoria(params: {
  userId: string;
  acao: string;
  entidade: string;
  entidadeId?: string | null;
  dadosAntes?: unknown;
  dadosDepois?: unknown;
}) {
  try {
    const supabase = await createClient();
    await supabase.from("auditoria").insert({
      user_id: params.userId,
      acao: params.acao,
      entidade: params.entidade,
      entidade_id: params.entidadeId ?? null,
      dados_antes: params.dadosAntes ?? null,
      dados_depois: params.dadosDepois ?? null,
    });
  } catch (e) {
    console.error("registrarAuditoria falhou:", e);
  }
}
