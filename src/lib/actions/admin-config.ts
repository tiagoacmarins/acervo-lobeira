"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { exigirAdmin } from "@/lib/admin/guard";
import { registrarAuditoria } from "@/lib/admin/auditoria";

async function upsertConfig(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  chave: string,
  valor: unknown,
) {
  await supabase
    .from("config_site")
    .upsert({ chave, valor, updated_at: new Date().toISOString(), updated_by: userId }, { onConflict: "chave" });
}

export async function salvarConfigAction(formData: FormData) {
  const sessao = await exigirAdmin();
  const supabase = await createClient();
  const campo = (nome: string) => String(formData.get(nome) ?? "").trim();

  const cep = campo("endereco_cep");

  await Promise.all([
    upsertConfig(supabase, sessao.userId, "nome", campo("nome")),
    upsertConfig(supabase, sessao.userId, "cnpj", campo("cnpj")),
    upsertConfig(supabase, sessao.userId, "endereco", {
      logradouro: campo("endereco_logradouro"),
      cidade: campo("endereco_cidade"),
      estado: campo("endereco_estado"),
      cep: cep || null,
    }),
    upsertConfig(supabase, sessao.userId, "telefone", campo("telefone")),
    upsertConfig(supabase, sessao.userId, "whatsapp_link", campo("whatsapp_link")),
    upsertConfig(supabase, sessao.userId, "email", campo("email")),
    upsertConfig(supabase, sessao.userId, "site_institucional", campo("site_institucional")),
    upsertConfig(supabase, sessao.userId, "redes_sociais", {
      instagram: campo("instagram"),
      youtube: campo("youtube"),
      tiktok: campo("tiktok"),
    }),
    upsertConfig(supabase, sessao.userId, "link_cursos", campo("link_cursos")),
    upsertConfig(supabase, sessao.userId, "link_checkout_assinatura", campo("link_checkout_assinatura") || null),
    upsertConfig(supabase, sessao.userId, "preco_assinatura_mensal", Number(campo("preco_assinatura_mensal")) || 0),
    upsertConfig(supabase, sessao.userId, "assinatura_editorial", campo("assinatura_editorial")),
  ]);

  await registrarAuditoria({ userId: sessao.userId, acao: "atualizar", entidade: "config_site" });

  revalidatePath("/admin/configuracoes");
  revalidatePath("/", "layout");
  redirect("/admin/configuracoes?mensagem=" + encodeURIComponent("Configurações salvas."));
}
