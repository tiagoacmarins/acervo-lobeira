"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { exigirAdminOuEditor, exigirAdmin } from "@/lib/admin/guard";
import { registrarAuditoria } from "@/lib/admin/auditoria";
import { slugify } from "@/lib/slug";

export async function salvarDisciplinaAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const ordem = Number(formData.get("ordem") ?? 0);

  if (!nome) redirect("/admin/disciplinas?erro=" + encodeURIComponent("Dê um nome para a disciplina."));

  const dados = { nome, descricao, ordem, slug: slugify(nome) };

  if (id) {
    await supabase.from("disciplinas").update(dados).eq("id", id);
    await registrarAuditoria({ userId: sessao.userId, acao: "atualizar", entidade: "disciplinas", entidadeId: id, dadosDepois: dados });
  } else {
    const { data } = await supabase.from("disciplinas").insert(dados).select("id").single();
    await registrarAuditoria({ userId: sessao.userId, acao: "criar", entidade: "disciplinas", entidadeId: data?.id, dadosDepois: dados });
  }

  revalidatePath("/admin/disciplinas");
  revalidatePath("/disciplinas");
  revalidatePath("/");
  redirect("/admin/disciplinas?mensagem=" + encodeURIComponent("Disciplina salva."));
}

export async function excluirDisciplinaAction(formData: FormData) {
  const sessao = await exigirAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("disciplinas").delete().eq("id", id);
  await registrarAuditoria({ userId: sessao.userId, acao: "excluir", entidade: "disciplinas", entidadeId: id });

  revalidatePath("/admin/disciplinas");
  revalidatePath("/disciplinas");
  revalidatePath("/");
  redirect("/admin/disciplinas?mensagem=" + encodeURIComponent("Disciplina excluída."));
}
