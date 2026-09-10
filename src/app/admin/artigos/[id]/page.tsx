import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { salvarArtigoAction } from "@/lib/actions/admin-artigos";
import { campoLabel, campoInput, campoTextarea, botaoPrimario } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Artigo · Admin" };

interface ArtigoFormData {
  id: string; titulo: string; subtitulo: string | null; pre_resumo: string | null; resumo: string | null;
  fonte: string | null; url_original: string | null; disciplina_id: string | null; status: string; capa_url: string | null;
  autor: { nome: string } | null;
}

export default async function AdminArtigoFormPage(props: PageProps<"/admin/artigos/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const erro = typeof sp.erro === "string" ? sp.erro : undefined;
  const novo = id === "novo";

  const supabase = await createClient();
  const { data: disciplinas } = await supabase.from("disciplinas").select("id,nome").order("ordem");

  let artigo: ArtigoFormData | null = null;

  if (!novo) {
    const { data } = await supabase
      .from("artigos")
      .select("id,titulo,subtitulo,pre_resumo,resumo,fonte,url_original,disciplina_id,status,capa_url,autor:autores(nome)")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    artigo = data as unknown as ArtigoFormData;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">{novo ? "Novo artigo" : "Editar artigo"}</h1>
      <p className="mt-1 text-sm text-cinza">
        Artigos são sempre gratuitos e de acesso aberto — não têm regra de exclusividade.
      </p>

      {erro && <p className="mt-3 rounded-md border border-ocre/30 bg-ocre/10 px-4 py-2 text-sm text-ocre">{erro}</p>}

      <form action={salvarArtigoAction} encType="multipart/form-data" className="mt-6 grid max-w-2xl gap-4">
        <input type="hidden" name="id" defaultValue={artigo?.id ?? ""} />

        <label className={campoLabel}>
          Título
          <input name="titulo" defaultValue={artigo?.titulo ?? ""} required className={campoInput} />
        </label>

        <label className={campoLabel}>
          Subtítulo (opcional)
          <input name="subtitulo" defaultValue={artigo?.subtitulo ?? ""} className={campoInput} />
        </label>

        <label className={campoLabel}>
          Pré-resumo (aparece em destaque, é o &ldquo;gancho&rdquo; pro leitor)
          <textarea name="pre_resumo" defaultValue={artigo?.pre_resumo ?? ""} className={campoTextarea} />
        </label>

        <label className={campoLabel}>
          Resumo completo (o texto de vocês sobre o artigo)
          <textarea name="resumo" defaultValue={artigo?.resumo ?? ""} className={campoTextarea} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className={campoLabel}>
            Disciplina
            <select name="disciplina_id" defaultValue={artigo?.disciplina_id ?? ""} className={campoInput}>
              <option value="">Sem disciplina</option>
              {disciplinas?.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </label>
          <label className={campoLabel}>
            Autor
            <input name="autor_nome" defaultValue={artigo?.autor?.nome ?? ""} className={campoInput} />
          </label>
        </div>

        <label className={campoLabel}>
          Fonte (nome do periódico/site original)
          <input name="fonte" defaultValue={artigo?.fonte ?? ""} className={campoInput} />
        </label>

        <label className={campoLabel}>
          Link do artigo original (acesso aberto)
          <input type="url" name="url_original" defaultValue={artigo?.url_original ?? ""} placeholder="https://..." className={campoInput} />
        </label>

        <label className={campoLabel}>
          Status
          <select name="status" defaultValue={artigo?.status ?? "rascunho"} className={campoInput}>
            <option value="rascunho">Rascunho (não aparece no site)</option>
            <option value="publicado">Publicado</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </label>

        <label className={campoLabel}>
          Capa (imagem, opcional)
          {artigo?.capa_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={artigo.capa_url} alt="Capa atual" className="mb-1 h-24 w-auto rounded-md border border-areia object-cover" />
          )}
          <input type="file" name="capa" accept="image/*" className={campoInput} />
        </label>

        <div className="mt-2 flex gap-3">
          <button type="submit" className={botaoPrimario}>Salvar</button>
          <Link href="/admin/artigos" className="self-center text-sm text-cinza underline">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
