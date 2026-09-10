"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { exigirAdminOuEditor, exigirAdmin } from "@/lib/admin/guard";
import { registrarAuditoria } from "@/lib/admin/auditoria";
import { gerarSlugUnico } from "@/lib/slug";
import { buscarOuCriarAutor } from "@/lib/admin/autores";

function extensao(nome: string) {
  const partes = nome.split(".");
  return partes.length > 1 ? partes.pop()!.toLowerCase() : "bin";
}

export async function salvarArtigoAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "") || null;
  const titulo = String(formData.get("titulo") ?? "").trim();
  const subtitulo = String(formData.get("subtitulo") ?? "").trim() || null;
  const preResumo = String(formData.get("pre_resumo") ?? "").trim() || null;
  const resumo = String(formData.get("resumo") ?? "").trim() || null;
  const fonte = String(formData.get("fonte") ?? "").trim() || null;
  const urlOriginal = String(formData.get("url_original") ?? "").trim() || null;
  const disciplinaId = String(formData.get("disciplina_id") ?? "") || null;
  const autorNome = String(formData.get("autor_nome") ?? "");
  const status = String(formData.get("status") ?? "rascunho");

  if (!titulo) {
    redirect(`/admin/artigos/${id ?? "novo"}?erro=${encodeURIComponent("Dê um título para o artigo.")}`);
  }

  const existente = id
    ? (await supabase.from("artigos").select("slug, publicado_em, capa_url").eq("id", id).single()).data
    : null;

  const slug = existente ? existente.slug : await gerarSlugUnico(supabase, "artigos", titulo);
  const autorId = await buscarOuCriarAutor(supabase, autorNome);
  const publicadoEm = status === "publicado" ? (existente?.publicado_em ?? new Date().toISOString()) : null;

  let capaUrl = existente?.capa_url ?? null;
  const arquivoCapa = formData.get("capa");
  if (arquivoCapa instanceof File && arquivoCapa.size > 0) {
    const caminho = `artigos/${slug}-capa-${Date.now()}.${extensao(arquivoCapa.name)}`;
    const { error } = await supabase.storage.from("capas").upload(caminho, arquivoCapa, { upsert: true });
    if (!error) capaUrl = supabase.storage.from("capas").getPublicUrl(caminho).data.publicUrl;
  }

  const dados = {
    titulo,
    subtitulo,
    pre_resumo: preResumo,
    resumo,
    fonte,
    url_original: urlOriginal,
    disciplina_id: disciplinaId,
    autor_id: autorId,
    status,
    publicado_em: publicadoEm,
    capa_url: capaUrl,
  };

  if (id) {
    await supabase.from("artigos").update(dados).eq("id", id);
    await registrarAuditoria({ userId: sessao.userId, acao: "atualizar", entidade: "artigos", entidadeId: id, dadosDepois: dados });
  } else {
    const { data: novoArtigo } = await supabase.from("artigos").insert({ ...dados, slug, created_by: sessao.userId }).select("id").single();
    await registrarAuditoria({ userId: sessao.userId, acao: "criar", entidade: "artigos", entidadeId: novoArtigo?.id, dadosDepois: dados });
  }

  revalidatePath("/admin/artigos");
  revalidatePath("/artigos");
  revalidatePath("/");
  if (slug) revalidatePath(`/artigos/${slug}`);
  redirect("/admin/artigos?mensagem=" + encodeURIComponent("Artigo salvo."));
}

export async function alternarStatusArtigoAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const novoStatus = String(formData.get("novo_status") ?? "");
  if (!id || !novoStatus) return;

  const { data: existente } = await supabase.from("artigos").select("publicado_em, slug").eq("id", id).single();
  const publicadoEm = novoStatus === "publicado" ? (existente?.publicado_em ?? new Date().toISOString()) : existente?.publicado_em ?? null;

  await supabase.from("artigos").update({ status: novoStatus, publicado_em: publicadoEm }).eq("id", id);
  await registrarAuditoria({ userId: sessao.userId, acao: `status:${novoStatus}`, entidade: "artigos", entidadeId: id });

  revalidatePath("/admin/artigos");
  revalidatePath("/artigos");
  revalidatePath("/");
  if (existente?.slug) revalidatePath(`/artigos/${existente.slug}`);
  redirect("/admin/artigos?mensagem=" + encodeURIComponent("Status atualizado."));
}

export async function excluirArtigoAction(formData: FormData) {
  const sessao = await exigirAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("artigos").delete().eq("id", id);
  await registrarAuditoria({ userId: sessao.userId, acao: "excluir", entidade: "artigos", entidadeId: id });

  revalidatePath("/admin/artigos");
  revalidatePath("/artigos");
  revalidatePath("/");
  redirect("/admin/artigos?mensagem=" + encodeURIComponent("Artigo excluído."));
}
