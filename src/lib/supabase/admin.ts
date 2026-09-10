import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a chave "service_role" — ignora todas as regras
 * de RLS. NUNCA importe este arquivo em um componente de cliente
 * ("use client") nem em código que roda no navegador.
 *
 * Uso previsto: webhooks de pagamento, geração de URL assinada para
 * download de arquivo exclusivo, ações administrativas no painel.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (ou NEXT_PUBLIC_SUPABASE_URL) não está configurada no .env.local",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
