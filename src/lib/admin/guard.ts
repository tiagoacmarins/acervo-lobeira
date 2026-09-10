import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface SessaoAdmin {
  userId: string;
  email: string | null;
  role: "admin" | "editor";
}

/**
 * Só deixa passar quem está logado E tem role admin/editor. Qualquer
 * outra pessoa é mandada embora antes de qualquer página do painel
 * renderizar — nada aqui depende de esconder um link no menu.
 */
export async function exigirAdminOuEditor(): Promise<SessaoAdmin> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/entrar?erro=" + encodeURIComponent("Entre com uma conta de administrador para acessar o painel."));
  }

  const { data: perfil } = await supabase.from("profiles").select("role").eq("id", auth.user.id).single();

  if (perfil?.role !== "admin" && perfil?.role !== "editor") {
    redirect("/?erro=" + encodeURIComponent("Sua conta não tem acesso ao painel administrativo."));
  }

  return { userId: auth.user.id, email: auth.user.email ?? null, role: perfil.role };
}

export async function exigirAdmin(): Promise<SessaoAdmin> {
  const sessao = await exigirAdminOuEditor();
  if (sessao.role !== "admin") {
    redirect("/admin?erro=" + encodeURIComponent("Só um administrador pode fazer isso."));
  }
  return sessao;
}
