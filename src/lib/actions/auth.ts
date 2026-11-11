"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** Só aceita caminhos internos (ex.: /materiais/x) — evita redirecionar para outro site. */
function destinoSeguro(valor: FormDataEntryValue | null, padrao: string) {
  const v = String(valor ?? "");
  return v.startsWith("/") && !v.startsWith("//") ? v : padrao;
}

function traduzErro(msg: string) {
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("User already registered")) return "Já existe uma conta com este e-mail.";
  if (msg.toLowerCase().includes("password")) return "Senha inválida (use pelo menos 6 caracteres).";
  if (msg.toLowerCase().includes("email")) return "E-mail inválido.";
  return "Não foi possível concluir. Tente novamente.";
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const next = destinoSeguro(formData.get("next"), "/minha-conta");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    redirect(`/entrar?erro=${encodeURIComponent(traduzErro(error.message))}&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const next = destinoSeguro(formData.get("next"), "/minha-conta");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome_completo: nome },
      emailRedirectTo: `${siteUrl()}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(`/registrar?erro=${encodeURIComponent(traduzErro(error.message))}&next=${encodeURIComponent(next)}`);
  }
  redirect("/registrar/verifique-seu-email");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/confirm?next=/redefinir-senha`,
  });

  // Sempre redireciona para a mesma tela de "verifique seu e-mail",
  // mesmo se o e-mail não existir no sistema — assim não revelamos
  // para quem está tentando adivinhar se um e-mail tem conta ou não.
  redirect("/recuperar-senha/verifique-seu-email");
}

export async function updatePasswordAction(formData: FormData) {
  const senha = String(formData.get("senha") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    redirect(`/redefinir-senha?erro=${encodeURIComponent(traduzErro(error.message))}`);
  }
  redirect("/entrar?mensagem=Senha atualizada. Faça login com a nova senha.");
}
