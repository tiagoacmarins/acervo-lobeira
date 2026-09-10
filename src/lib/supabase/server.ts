import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para uso no servidor (Server Components, Server
 * Actions, Route Handlers). Lê/escreve a sessão do usuário via cookies.
 * Ainda usa a chave "anon" — as regras de RLS do banco decidem o que
 * cada usuário pode ver, mesmo no servidor.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Chamado de um Server Component (sem permissão de escrever
            // cookie) — o middleware já cuida de renovar a sessão nesse
            // caso, então é seguro ignorar aqui.
          }
        },
      },
    },
  );
}
