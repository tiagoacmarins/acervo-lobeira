import type { EventoPagamentoNormalizado, PaymentProvider, TipoEventoPagamento } from "./types";

/**
 * Adaptador da Kiwify.
 *
 * IMPORTANTE — leia antes de mexer aqui:
 * A Kiwify não publica publicamente o formato exato de cada campo do
 * payload (fica numa documentação fechada, só visível depois de
 * configurar um webhook de verdade na conta). O que EU CONFIRMEI na
 * documentação oficial (não inventei):
 *
 *   - Os nomes dos eventos existem de verdade: compra_aprovada,
 *     compra_recusada, compra_reembolsada, chargeback,
 *     subscription_renewed, subscription_canceled, subscription_late,
 *     boleto_gerado, pix_gerado, carrinho_abandonado.
 *   - Cada webhook criado tem um "token" (chave de autenticação) que a
 *     Kiwify usa pra você validar que a chamada é mesmo dela.
 *   - Em integrações reais publicadas (ex.: github.com/CarlosDevlpr/Kiwi-Hook),
 *     o payload tem um objeto "Customer" com "full_name" e "email".
 *
 * O que é PALPITE INFORMADO (o mais comum em plataformas parecidas,
 * mas não 100% confirmado pela Kiwify) e precisa ser conferido no
 * primeiro evento real:
 *   - O nome do evento vindo em `payload.webhook_event_type` ou
 *     `payload.order_status`.
 *   - O token vindo como `?signature=` ou `?token=` na URL do webhook.
 *   - O ID do produto em `payload.Product.product_id`.
 *
 * COMO AJUSTAR QUANDO TIVER A CONTA DA KIWIFY:
 * 1. Configure o webhook apontando pra
 *    https://acervolobeira.com.br/api/webhooks/kiwify?token=SEU_TOKEN
 * 2. Clique em "testar" no painel da Kiwify (ou faça uma compra de
 *    teste). O evento chega e fica salvo, cru, na tabela
 *    `webhook_events` (coluna `payload`) — mesmo que a extração abaixo
 *    erre feio.
 * 3. Olhe o JSON salvo e ajuste as linhas marcadas "AJUSTAR AQUI".
 */

const MAPA_EVENTOS: Record<string, TipoEventoPagamento> = {
  compra_aprovada: "compra_aprovada",
  paid: "compra_aprovada",
  order_approved: "compra_aprovada",
  compra_recusada: "compra_recusada",
  refused: "compra_recusada",
  compra_reembolsada: "compra_reembolsada",
  refunded: "compra_reembolsada",
  chargeback: "chargeback",
  chargedback: "chargeback",
  subscription_renewed: "subscription_renewed",
  subscription_canceled: "subscription_canceled",
  subscription_late: "subscription_late",
  boleto_gerado: "boleto_gerado",
  pix_gerado: "pix_gerado",
  carrinho_abandonado: "carrinho_abandonado",
};

function primeiro<T>(...valores: (T | undefined | null)[]): T | null {
  for (const v of valores) if (v !== undefined && v !== null && v !== "") return v;
  return null;
}

export const kiwifyProvider: PaymentProvider = {
  nome: "kiwify",

  verificarAutenticidade(request: Request): boolean {
    const tokenEsperado = process.env.KIWIFY_WEBHOOK_TOKEN;
    if (!tokenEsperado) {
      // PENDENTE: sem token configurado ainda, não dá pra confirmar
      // autenticidade — melhor recusar tudo do que aceitar qualquer
      // coisa sem checagem.
      return false;
    }
    const url = new URL(request.url);
    // AJUSTAR AQUI se a Kiwify usar outro nome de parâmetro.
    const recebido = primeiro(url.searchParams.get("signature"), url.searchParams.get("token"));
    return recebido === tokenEsperado;
  },

  extrairEvento(payloadBruto: unknown): EventoPagamentoNormalizado | null {
    if (!payloadBruto || typeof payloadBruto !== "object") return null;
    const p = payloadBruto as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

    // AJUSTAR AQUI: nome do campo que identifica o tipo de evento.
    const chaveEvento = primeiro<string>(p.webhook_event_type, p.order_status, p.event, p.status);
    const tipo = (chaveEvento && MAPA_EVENTOS[String(chaveEvento).toLowerCase()]) || "ignorado";

    // AJUSTAR AQUI: de onde vem um ID único e estável do evento (pra
    // idempotência). Se a Kiwify não mandar um, cai no order_id.
    const providerEventId = String(
      primeiro<string | number>(p.webhook_event_id, p.order_id, p.id, p.subscription_id) ?? crypto.randomUUID(),
    );

    const cliente = p.Customer ?? p.customer ?? {};
    const produto = p.Product ?? p.product ?? {};

    return {
      tipo,
      providerEventId,
      emailCliente: primeiro<string>(cliente.email, p.customer_email),
      nomeCliente: primeiro<string>(cliente.full_name, cliente.name, p.customer_name),
      providerProductId: primeiro<string>(produto.product_id, produto.id, p.product_id) ,
    };
  },
};
