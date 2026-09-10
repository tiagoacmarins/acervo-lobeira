"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { exigirAdmin, exigirAdminOuEditor } from "@/lib/admin/guard";
import { registrarAuditoria } from "@/lib/admin/auditoria";
import { buscarIdPorEmail } from "@/lib/admin/usuarios";

async function planoAtivoId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from("planos").select("id").eq("ativo", true).limit(1).maybeSingle();
  return data?.id ?? null;
}

export async function alterarRoleAction(formData: FormData) {
  const sessao = await exigirAdmin();
  const supabase = await createClient();
  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "usuario");
  if (!userId) return;

  await supabase.from("profiles").update({ role }).eq("id", userId);
  await registrarAuditoria({ userId: sessao.userId, acao: `role:${role}`, entidade: "profiles", entidadeId: userId });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?mensagem=" + encodeURIComponent("Papel do usuário atualizado."));
}

export async function concederAssinaturaAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();
  const userId = String(formData.get("user_id") ?? "");
  const dias = Number(formData.get("dias") ?? 30) || 30;
  if (!userId) return;

  const fim = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();
  const planoId = await planoAtivoId(supabase);

  await supabase.from("assinaturas").insert({ user_id: userId, plano_id: planoId, status: "ativa", provider: "manual", fim });
  await supabase.from("concessoes_manuais").insert({
    user_id: userId,
    tipo: "assinatura",
    motivo: `Concedida manualmente pelo painel (${dias} dias)`,
    concedido_por: sessao.userId,
    fim,
  });
  await registrarAuditoria({ userId: sessao.userId, acao: "conceder_assinatura", entidade: "assinaturas", entidadeId: userId, dadosDepois: { dias } });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?mensagem=" + encodeURIComponent("Assinatura concedida."));
}

export async function revogarAssinaturaAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();
  const userId = String(formData.get("user_id") ?? "");
  if (!userId) return;

  await supabase.from("assinaturas").update({ status: "cancelada", fim: new Date().toISOString() }).eq("user_id", userId).eq("status", "ativa");
  await registrarAuditoria({ userId: sessao.userId, acao: "revogar_assinatura", entidade: "assinaturas", entidadeId: userId });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?mensagem=" + encodeURIComponent("Assinatura revogada."));
}

export async function criarProdutoElegivelAction(formData: FormData) {
  const sessao = await exigirAdmin();
  const supabase = await createClient();
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) redirect("/admin/usuarios?erro=" + encodeURIComponent("Dê um nome para o curso."));

  await supabase.from("produtos_elegiveis").insert({ nome, provider: "manual" });
  await registrarAuditoria({ userId: sessao.userId, acao: "criar", entidade: "produtos_elegiveis" });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?mensagem=" + encodeURIComponent("Curso elegível criado."));
}

export async function concederMatriculaAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();
  const userId = String(formData.get("user_id") ?? "");
  const produtoElegivelId = String(formData.get("produto_elegivel_id") ?? "");
  const dias = Number(formData.get("dias") ?? 365) || 365;
  if (!userId || !produtoElegivelId) {
    redirect("/admin/usuarios?erro=" + encodeURIComponent("Escolha o curso elegível antes de conceder a matrícula."));
  }

  const fim = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("matriculas_cursos").insert({ user_id: userId, produto_elegivel_id: produtoElegivelId, status: "ativa", fim });
  await supabase.from("concessoes_manuais").insert({
    user_id: userId,
    tipo: "matricula",
    motivo: `Matrícula concedida manualmente pelo painel (${dias} dias)`,
    concedido_por: sessao.userId,
    fim,
  });
  await registrarAuditoria({ userId: sessao.userId, acao: "conceder_matricula", entidade: "matriculas_cursos", entidadeId: userId });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?mensagem=" + encodeURIComponent("Matrícula concedida."));
}

export async function revogarMatriculaAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();
  const userId = String(formData.get("user_id") ?? "");
  if (!userId) return;

  await supabase.from("matriculas_cursos").update({ status: "cancelada", fim: new Date().toISOString() }).eq("user_id", userId).eq("status", "ativa");
  await registrarAuditoria({ userId: sessao.userId, acao: "revogar_matricula", entidade: "matriculas_cursos", entidadeId: userId });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?mensagem=" + encodeURIComponent("Matrícula revogada."));
}

export async function importarAssinantesCsvAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();
  const arquivo = formData.get("csv");
  const dias = Number(formData.get("dias") ?? 30) || 30;

  if (!(arquivo instanceof File) || arquivo.size === 0) {
    redirect("/admin/usuarios?erro=" + encodeURIComponent("Escolha um arquivo CSV."));
  }

  const texto = await (arquivo as File).text();
  const linhas = texto
    .split(/\r?\n/)
    .map((l) => l.split(",")[0]?.trim())
    .filter((l) => l && l.includes("@") && l.toLowerCase() !== "email");

  const planoId = await planoAtivoId(supabase);
  const fim = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();

  let concedidas = 0;
  const naoEncontrados: string[] = [];

  for (const email of linhas) {
    const userId = await buscarIdPorEmail(email);
    if (!userId) {
      naoEncontrados.push(email);
      continue;
    }
    await supabase.from("assinaturas").insert({ user_id: userId, plano_id: planoId, status: "ativa", provider: "manual", fim });
    await supabase.from("concessoes_manuais").insert({
      user_id: userId,
      tipo: "assinatura",
      motivo: `Importado por CSV (${dias} dias)`,
      concedido_por: sessao.userId,
      fim,
    });
    concedidas++;
  }

  await registrarAuditoria({
    userId: sessao.userId,
    acao: "importar_csv_assinantes",
    entidade: "assinaturas",
    dadosDepois: { concedidas, naoEncontrados: naoEncontrados.length },
  });

  revalidatePath("/admin/usuarios");
  const resumo = `${concedidas} assinatura(s) concedida(s).` + (naoEncontrados.length ? ` ${naoEncontrados.length} e-mail(s) sem conta no site: ${naoEncontrados.slice(0, 5).join(", ")}${naoEncontrados.length > 5 ? "..." : ""}` : "");
  redirect("/admin/usuarios?mensagem=" + encodeURIComponent(resumo));
}
