import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no navegador (componentes com "use client").
 * Usa a chave "anon" — segura para expor, protegida pelas regras de RLS.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
