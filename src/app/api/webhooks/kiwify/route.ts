import { NextResponse, type NextRequest } from "next/server";
import { kiwifyProvider } from "@/lib/payments/kiwify";
import { processarEventoPagamento } from "@/lib/payments/processar";

/**
 * Endpoint real que a Kiwify vai chamar. Configure na Kiwify (Apps >
 * Webhooks) a URL:
 *
 *   https://acervolobeira.com.br/api/webhooks/kiwify?token=SEU_TOKEN
 *
 * ...usando o mesmo valor em KIWIFY_WEBHOOK_TOKEN no .env. Sem essa
 * variável configurada, este endpoint recusa TODAS as chamadas (por
 * segurança — melhor recusar tudo do que aceitar sem checar).
 */
export async function POST(request: NextRequest) {
  if (!kiwifyProvider.verificarAutenticidade(request)) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  const payloadBruto = await request.json().catch(() => null);
  const evento = kiwifyProvider.extrairEvento(payloadBruto);

  if (!evento) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  const resultado = await processarEventoPagamento("kiwify", evento, payloadBruto);
  return NextResponse.json(resultado);
}
