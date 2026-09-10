import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * O link de confirmação de e-mail e o de "esqueci minha senha" do
 * Supabase apontam para esta rota. Ela valida o link e, se for válido,
 * já deixa o usuário logado (ou com uma sessão temporária, no caso de
 * redefinir senha) antes de mandar para a próxima página.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/entrar?erro=${encodeURIComponent("Link inválido ou expirado. Tente de novo.")}`,
  );
}
