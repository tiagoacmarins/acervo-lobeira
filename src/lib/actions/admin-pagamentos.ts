"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { exigirAdmin, exigirAdminOuEditor } from "@/lib/admin/guard";
import { registrarAuditoria } from "@/lib/admin/auditoria";
import { processarEventoPagamento } from "@/lib/payments/processar";
import type { EventoPagamentoNormalizado, TipoEventoPagamento } from "@/lib/payments/types";

export async function salvarMapeamentoProdutoAction(formData: FormData) {
  const sessao = await exigirAdmin();
  const supabase = await createClient();

  const tipo = String(formData.get("tipo") ?? "");
  const id = String(formData.get("id") ?? "");
  const providerProductId = String(formData.get("provider_product_id") ?? "").trim() || null;
  if (!tipo || !id) return;

  const tabela = tipo === "plano" ? "planos" : "produtos_elegiveis";
  await supabase.from(tabela).update({ provider: "kiwify", provider_product_id: providerProductId }).eq("id", id);
  await registrarAuditoria({ userId: sessao.userId, acao: "mapear_produto_kiwify", entidade: tabela, entidadeId: id });

  revalidatePath("/admin/pagamentos");
  redirect("/admin/pagamentos?mensagem=" + encodeURIComponent("Mapeamento salvo."));
}

const TIPOS_VALIDOS: TipoEventoPagamento[] = [
  "compra_aprovada",
  "compra_recusada",
  "compra_reembolsada",
  "chargeback",
  "subscription_renewed",
  "subscription_canceled",
  "subscription_late",
];

export async function simularEventoAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();

  const tipo = String(formData.get("tipo") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const providerProductId = String(formData.get("provider_product_id") ?? "").trim() || null;

  if (!TIPOS_VALIDOS.includes(tipo as TipoEventoPagamento) || !email) {
    redirect("/admin/pagamentos?erro=" + encodeURIComponent("Escolha um tipo de evento e informe o e-mail do cliente de teste."));
  }

  const evento: EventoPagamentoNormalizado = {
    tipo: tipo as TipoEventoPagamento,
    providerEventId: crypto.randomUUID(),
    emailCliente: email,
    nomeCliente: null,
    providerProductId,
  };

  const resultado = await processarEventoPagamento(
    "kiwify_simulado",
    evento,
    { simulado: true, criado_por: sessao.email, ...evento },
    sessao.userId,
  );

  revalidatePath("/admin/pagamentos");
  redirect("/admin/pagamentos?mensagem=" + encodeURIComponent(`Simulação: ${resultado.detalhe}`));
}
