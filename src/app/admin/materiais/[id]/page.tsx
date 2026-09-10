import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { salvarMaterialAction } from "@/lib/actions/admin-materiais";
import { REGRA_ACESSO_LABELS, TIPO_MATERIAL_LABELS } from "@/lib/labels";
import { campoLabel, campoInput, campoTextarea, botaoPrimario } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Material · Admin" };

interface MaterialFormData {
  id: string; titulo: string; subtitulo: string | null; resumo: string | null; tipo: string; especie: string | null;
  disciplina_id: string | null; regra_acesso: string; status: string; capa_url: string | null;
  autor: { nome: string } | null;
}

export default async function AdminMaterialFormPage(props: PageProps<"/admin/materiais/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const erro = typeof sp.erro === "string" ? sp.erro : undefined;
  const novo = id === "novo";

  const supabase = await createClient();
  const { data: disciplinas } = await supabase.from("disciplinas").select("id,nome").order("ordem");

  let material: MaterialFormData | null = null;

  if (!novo) {
    const { data } = await supabase
      .from("materiais")
      .select("id,titulo,subtitulo,resumo,tipo,especie,disciplina_id,regra_acesso,status,capa_url,autor:autores(nome)")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    material = data as unknown as MaterialFormData;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">{novo ? "Novo material" : "Editar material"}</h1>

      {erro && <p className="mt-3 rounded-md border border-ocre/30 bg-ocre/10 px-4 py-2 text-sm text-ocre">{erro}</p>}

      <form action={salvarMaterialAction} encType="multipart/form-data" className="mt-6 grid max-w-2xl gap-4">
        <input type="hidden" name="id" defaultValue={material?.id ?? ""} />

        <label className={campoLabel}>
          Título
          <input name="titulo" defaultValue={material?.titulo ?? ""} required className={campoInput} />
        </label>

        <label className={campoLabel}>
          Subtítulo (opcional)
          <input name="subtitulo" defaultValue={material?.subtitulo ?? ""} className={campoInput} />
        </label>

        <label className={campoLabel}>
          Resumo
          <textarea name="resumo" defaultValue={material?.resumo ?? ""} className={campoTextarea} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className={campoLabel}>
            Disciplina
            <select name="disciplina_id" defaultValue={material?.disciplina_id ?? ""} className={campoInput}>
              <option value="">Sem disciplina</option>
              {disciplinas?.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </label>

          <label className={campoLabel}>
            Tipo
            <select name="tipo" defaultValue={material?.tipo ?? "apostila"} className={campoInput}>
              {Object.entries(TIPO_MATERIAL_LABELS).map(([valor, label]) => (
                <option key={valor} value={valor}>{label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className={campoLabel}>
            Autor
            <input name="autor_nome" defaultValue={material?.autor?.nome ?? ""} placeholder="Nome do autor" className={campoInput} />
          </label>
          <label className={campoLabel}>
            Espécie (opcional)
            <input name="especie" defaultValue={material?.especie ?? ""} className={campoInput} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className={campoLabel}>
            Regra de acesso
            <select name="regra_acesso" defaultValue={material?.regra_acesso ?? "exclusivo_assinante"} className={campoInput}>
              {Object.entries(REGRA_ACESSO_LABELS).map(([valor, label]) => (
                <option key={valor} value={valor}>{label}</option>
              ))}
            </select>
          </label>
          <label className={campoLabel}>
            Status
            <select name="status" defaultValue={material?.status ?? "rascunho"} className={campoInput}>
              <option value="rascunho">Rascunho (não aparece no site)</option>
              <option value="publicado">Publicado</option>
              <option value="arquivado">Arquivado</option>
            </select>
          </label>
        </div>

        <label className={campoLabel}>
          Capa (imagem, opcional)
          {material?.capa_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={material.capa_url} alt="Capa atual" className="mb-1 h-24 w-auto rounded-md border border-areia object-cover" />
          )}
          <input type="file" name="capa" accept="image/*" className={campoInput} />
        </label>

        <label className={campoLabel}>
          PDF do material (opcional — fica no bucket privado, protegido)
          <input type="file" name="pdf" accept="application/pdf" className={campoInput} />
        </label>

        <div className="mt-2 flex gap-3">
          <button type="submit" className={botaoPrimario}>Salvar</button>
          <Link href="/admin/materiais" className="self-center text-sm text-cinza underline">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
