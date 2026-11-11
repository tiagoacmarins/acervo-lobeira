import { createClient } from "@/lib/supabase/server";

export interface Entitlements {
  assinanteAtivo: boolean;
  alunoAtivo: boolean;
}

export const SEM_ENTITLEMENTS: Entitlements = { assinanteAtivo: false, alunoAtivo: false };

/**
 * Busca se o usuário logado tem assinatura ativa e/ou matrícula ativa
 * em curso elegível. Sempre roda no servidor, sempre a partir da
 * própria sessão do usuário (RLS: "assinaturas_select"/"matriculas_select"
 * só deixam ver as próprias linhas) — nunca confia em nada vindo do
 * navegador.
 */
export async function obterEntitlements(userId: string | null): Promise<Entitlements> {
  if (!userId) return SEM_ENTITLEMENTS;

  const supabase = await createClient();
  const agora = new Date().toISOString();

  const [{ data: assinaturas }, { data: matriculas }] = await Promise.all([
    supabase
      .from("assinaturas")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "ativa")
      .or(`fim.is.null,fim.gt.${agora}`)
      .limit(1),
    supabase
      .from("matriculas_cursos")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "ativa")
      .or(`fim.is.null,fim.gt.${agora}`)
      .limit(1),
  ]);

  return {
    assinanteAtivo: (assinaturas?.length ?? 0) > 0,
    alunoAtivo: (matriculas?.length ?? 0) > 0,
  };
}

/**
 * Regra de acesso de um material -> pode ver/baixar o ARQUIVO?
 * (A página do material em si é SEMPRE pública, isso aqui é só sobre
 * o arquivo protegido.)
 */
export function podeAcessarArquivo(regraAcesso: string, ent: Entitlements): boolean {
  switch (regraAcesso) {
    case "indisponivel":
      return false;
    case "exclusivo_assinante":
      return ent.assinanteAtivo;
    case "exclusivo_aluno":
      return ent.alunoAtivo;
    // "publico", "todos_acesso_completo", "somente_visualizacao" e
    // "visualizacao_download" são liberados pra qualquer um, inclusive
    // visitante sem login — a diferença entre elas é só se o arquivo
    // pode ser baixado ou só visualizado (ver tipoArquivoPermitido).
    default:
      return true;
  }
}

/** Qual tipo de arquivo essa regra libera: só prévia, ou o arquivo completo. */
export function tipoArquivoPermitido(regraAcesso: string): "pdf" | "preview" {
  return regraAcesso === "somente_visualizacao" ? "preview" : "pdf";
}

/** true = a regra do material exige login + assinatura/matrícula para o arquivo. */
export function exigeEntitlement(regraAcesso: string): boolean {
  return regraAcesso === "exclusivo_assinante" || regraAcesso === "exclusivo_aluno";
}

/**
 * O Acervo é 100% gratuito: toda regra de acesso é tratada como
 * "publico", exceto "indisponivel", que continua indisponível.
 * (As regras antigas continuam gravadas no banco, só não são mais usadas.)
 */
export function regraEfetiva(regraAcesso: string): "publico" | "indisponivel" {
  return regraAcesso === "indisponivel" ? "indisponivel" : "publico";
}
