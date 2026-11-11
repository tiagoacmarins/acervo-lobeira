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

export async function salvarMaterialAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "") || null;
  const titulo = String(formData.get("titulo") ?? "").trim();
  const subtitulo = String(formData.get("subtitulo") ?? "").trim() || null;
  const resumo = String(formData.get("resumo") ?? "").trim() || null;
  const tipo = String(formData.get("tipo") ?? "outro");
  const especie = String(formData.get("especie") ?? "").trim() || null;
  const disciplinaId = String(formData.get("disciplina_id") ?? "") || null;
  const autorNome = String(formData.get("autor_nome") ?? "");
  const regraAcesso = String(formData.get("regra_acesso") ?? "publico");
  const status = String(formData.get("status") ?? "rascunho");

  if (!titulo) {
    redirect(`/admin/materiais/${id ?? "novo"}?erro=${encodeURIComponent("Dê um título para o material.")}`);
  }

  const existente = id
    ? (await supabase.from("materiais").select("slug, status, publicado_em, capa_url").eq("id", id).single()).data
    : null;

  const slug = existente ? existente.slug : await gerarSlugUnico(supabase, "materiais", titulo);
  const autorId = await buscarOuCriarAutor(supabase, autorNome);

  const publicadoEm = status === "publicado" ? (existente?.publicado_em ?? new Date().toISOString()) : null;

  // Capa (bucket público)
  let capaUrl = existente?.capa_url ?? null;
  const arquivoCapa = formData.get("capa");
  if (arquivoCapa instanceof File && arquivoCapa.size > 0) {
    const caminho = `materiais/${slug}-capa-${Date.now()}.${extensao(arquivoCapa.name)}`;
    const { error } = await supabase.storage.from("capas").upload(caminho, arquivoCapa, { upsert: true });
    if (!error) {
      capaUrl = supabase.storage.from("capas").getPublicUrl(caminho).data.publicUrl;
    }
  }

  const dados = {
    titulo,
    subtitulo,
    resumo,
    tipo,
    especie,
    disciplina_id: disciplinaId,
    autor_id: autorId,
    regra_acesso: regraAcesso,
    status,
    publicado_em: publicadoEm,
    capa_url: capaUrl,
  };

  let materialId = id;
  if (id) {
    await supabase.from("materiais").update(dados).eq("id", id);
    await registrarAuditoria({ userId: sessao.userId, acao: "atualizar", entidade: "materiais", entidadeId: id, dadosDepois: dados });
  } else {
    const { data: novo } = await supabase.from("materiais").insert({ ...dados, slug, created_by: sessao.userId }).select("id").single();
    materialId = novo?.id ?? null;
    await registrarAuditoria({ userId: sessao.userId, acao: "criar", entidade: "materiais", entidadeId: materialId, dadosDepois: dados });
  }

  // PDF (bucket privado — nunca fica público)
  const arquivoPdf = formData.get("pdf");
  if (materialId && arquivoPdf instanceof File && arquivoPdf.size > 0) {
    const caminho = `materiais/${slug}.pdf`;
    const { error } = await supabase.storage.from("materiais-privados").upload(caminho, arquivoPdf, { upsert: true });
    if (!error) {
      const { data: arquivoExistente } = await supabase
        .from("arquivos")
        .select("id")
        .eq("material_id", materialId)
        .eq("tipo", "pdf")
        .maybeSingle();

      const dadosArquivo = {
        material_id: materialId,
        tipo: "pdf",
        bucket: "materiais-privados",
        storage_path: caminho,
        mime_type: arquivoPdf.type || "application/pdf",
        tamanho_bytes: arquivoPdf.size,
      };

      if (arquivoExistente) {
        await supabase.from("arquivos").update(dadosArquivo).eq("id", arquivoExistente.id);
      } else {
        await supabase.from("arquivos").insert(dadosArquivo);
      }
    }
  }

  revalidatePath("/admin/materiais");
  revalidatePath("/materiais");
  revalidatePath("/");
  if (slug) revalidatePath(`/materiais/${slug}`);
  redirect("/admin/materiais?mensagem=" + encodeURIComponent("Material salvo."));
}

export async function alternarStatusMaterialAction(formData: FormData) {
  const sessao = await exigirAdminOuEditor();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const novoStatus = String(formData.get("novo_status") ?? "");
  if (!id || !novoStatus) return;

  const { data: existente } = await supabase.from("materiais").select("publicado_em, slug").eq("id", id).single();
  const publicadoEm = novoStatus === "publicado" ? (existente?.publicado_em ?? new Date().toISOString()) : existente?.publicado_em ?? null;

  await supabase.from("materiais").update({ status: novoStatus, publicado_em: publicadoEm }).eq("id", id);
  await registrarAuditoria({ userId: sessao.userId, acao: `status:${novoStatus}`, entidade: "materiais", entidadeId: id });

  revalidatePath("/admin/materiais");
  revalidatePath("/materiais");
  revalidatePath("/");
  if (existente?.slug) revalidatePath(`/materiais/${existente.slug}`);
  redirect("/admin/materiais?mensagem=" + encodeURIComponent("Status atualizado."));
}

export async function excluirMaterialAction(formData: FormData) {
  const sessao = await exigirAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("materiais").delete().eq("id", id);
  await registrarAuditoria({ userId: sessao.userId, acao: "excluir", entidade: "materiais", entidadeId: id });

  revalidatePath("/admin/materiais");
  revalidatePath("/materiais");
  revalidatePath("/");
  redirect("/admin/materiais?mensagem=" + encodeURIComponent("Material excluído."));
}
