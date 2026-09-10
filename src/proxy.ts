import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// No Next.js 16, o que antes se chamava "Middleware" passou a se
// chamar "Proxy" (mesma função, nome novo). É isto que mantém a sessão
// de login sempre renovada antes de cada página.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
