import { createAdminClient } from "@/lib/supabase/admin";
import { buscarIdPorEmail } from "@/lib/admin/usuarios";
import type { EventoPagamentoNormalizado } from "./types";

const SEM_ACAO_DE_ACESSO = new Set(["boleto_gerado", "pix_gerado", "carrinho_abandonado", "compra_recusada", "ignorado"]);

export interface ResultadoProcessamento {
  status: string;
  detalhe: string;
}

/**
 * Processa 1 evento de pagamento já normalizado. Sempre roda com a
 * chave service_role (webhooks reais não têm sessão de usuário
 * logado) e sempre grava em `webhook_events` primeiro — reprocessar o
 * MESMO evento (mesmo provider + provider_event_id) nunca duplica
 * acesso (Guardrail de idempotência).
 */
export async function processarEventoPagamento(
  provider: string,
  evento: EventoPagamentoNormalizado,
  payloadBruto: unknown,
  acionadoPor: string | null = null,
): Promise<ResultadoProcessamento> {
  const admin = createAdminClient();

  const { data: existente } = await admin
    .from("webhook_events")
    .select("id, status")
    .eq("provider", provider)
    .eq("provider_event_id", evento.providerEventId)
    .maybeSingle();

  if (existente?.status === "processado") {
    return { status: "ja_processado", detalhe: "Este evento já tinha sido processado antes — nada duplicado." };
  }

  let webhookEventId = existente?.id as string | undefined;
  if (!webhookEventId) {
    const { data: novo } = await admin
      .from("webhook_events")
      .insert({ provider, provider_event_id: evento.providerEventId, tipo_evento: evento.tipo, payload: payloadBruto as object })
      .select("id")
      .single();
    webhookEventId = novo?.id;
  }

  async function finalizar(status: string, detalhe: string): Promise<ResultadoProcessamento> {
    if (webhookEventId) {
      await admin.from("webhook_events").update({ status, processado_em: new Date().toISOString(), erro: status.startsWith("erro") || status.includes("nao_encontrado") || status.includes("nao_mapeado") ? detalhe : null }).eq("id", webhookEventId);
    }
    await admin.from("auditoria").insert({
      user_id: acionadoPor,
      acao: `webhook_${provider}:${evento.tipo}`,
      entidade: "webhook_events",
      entidade_id: webhookEventId,
      dados_depois: { status, detalhe, email: evento.emailCliente },
    });
    return { status, detalhe };
  }

  if (SEM_ACAO_DE_ACESSO.has(evento.tipo)) {
    return finalizar("ignorado_sem_acao", "Evento registrado, mas não libera nem revoga acesso.");
  }

  if (!evento.emailCliente) {
    return finalizar("sem_email", "O evento não trouxe um e-mail de cliente — não dá pra saber de quem é.");
  }

  const userId = await buscarIdPorEmail(evento.emailCliente);
  if (!userId) {
    return finalizar("usuario_nao_encontrado", `Ninguém com o e-mail ${evento.emailCliente} tem conta no site ainda.`);
  }

  if (evento.tipo === "compra_aprovada" || evento.tipo === "subscription_renewed") {
    if (!evento.providerProductId) {
      return finalizar("produto_nao_informado", "O evento não trouxe o ID do produto da Kiwify.");
    }

    const { data: plano } = await admin.from("planos").select("id").eq("provider", "kiwify").eq("provider_product_id", evento.providerProductId).maybeSingle();
    if (plano) {
      const fim = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await admin.from("assinaturas").insert({ user_id: userId, plano_id: plano.id, status: "ativa", provider: "kiwify", provider_subscription_id: evento.providerEventId, fim });
      return finalizar("assinatura_concedida", "Assinatura liberada com base na compra na Kiwify.");
    }

    const { data: produto } = await admin.from("produtos_elegiveis").select("id").eq("provider", "kiwify").eq("provider_product_id", evento.providerProductId).maybeSingle();
    if (produto) {
      const fim = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      await admin.from("matriculas_cursos").insert({ user_id: userId, produto_elegivel_id: produto.id, status: "ativa", provider_enrollment_id: evento.providerEventId, fim });
      return finalizar("matricula_concedida", "Matrícula liberada com base na compra na Kiwify.");
    }

    return finalizar("produto_nao_mapeado", `Produto Kiwify "${evento.providerProductId}" não está ligado a nenhum plano/curso — mapeie no painel.`);
  }

  if (evento.tipo === "subscription_canceled" || evento.tipo === "compra_reembolsada" || evento.tipo === "chargeback") {
    await admin.from("assinaturas").update({ status: "cancelada", fim: new Date().toISOString() }).eq("user_id", userId).eq("status", "ativa");
    return finalizar("assinatura_revogada", "Assinatura cancelada/revogada.");
  }

  if (evento.tipo === "subscription_late") {
    await admin.from("assinaturas").update({ status: "inadimplente" }).eq("user_id", userId).eq("status", "ativa");
    return finalizar("assinatura_inadimplente", "Assinatura marcada como inadimplente (ainda não cancelada).");
  }

  return finalizar("ignorado_sem_acao", "Tipo de evento não reconhecido.");
}
