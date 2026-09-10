/**
 * Contrato comum pra qualquer provedor de pagamento (padrão adaptador).
 * Hoje só existe o adaptador da Kiwify, mas se um dia entrar outro
 * provedor, ele implementa a mesma interface e o resto do sistema
 * (idempotência, concessão de acesso) não muda nada.
 */

export type TipoEventoPagamento =
  | "compra_aprovada"
  | "compra_recusada"
  | "compra_reembolsada"
  | "chargeback"
  | "subscription_renewed"
  | "subscription_canceled"
  | "subscription_late"
  | "boleto_gerado"
  | "pix_gerado"
  | "carrinho_abandonado"
  | "ignorado";

export interface EventoPagamentoNormalizado {
  tipo: TipoEventoPagamento;
  /** ID do evento dado pelo provedor — usado pra nunca processar o mesmo evento duas vezes. */
  providerEventId: string;
  emailCliente: string | null;
  nomeCliente: string | null;
  /** ID do produto no provedor (para achar o plano/curso equivalente no nosso banco). */
  providerProductId: string | null;
}

export interface PaymentProvider {
  nome: string;
  /** Confere se a chamada realmente veio do provedor (token/assinatura). */
  verificarAutenticidade(request: Request): boolean;
  /** Transforma o corpo bruto do webhook no formato que o resto do sistema entende. */
  extrairEvento(payloadBruto: unknown): EventoPagamentoNormalizado | null;
}
