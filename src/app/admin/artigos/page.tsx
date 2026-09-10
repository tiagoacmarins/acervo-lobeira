import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { alternarStatusArtigoAction, excluirArtigoAction } from "@/lib/actions/admin-artigos";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import DemoBadge from "@/components/DemoBadge";
import { botaoPrimario, tabela, th, td } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Artigos · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminArtigosPage(props: PageProps<"/admin/artigos">) {
  const sp = await props.searchParams;
  const mensagem = typeof sp.mensagem === "string" ? sp.mensagem : undefined;

  const supabase = await createClient();
  const { data: artigos } = await supabase
    .from("artigos")
    .select("id,slug,titulo,status,is_demo,visualizacoes_count,disciplina:disciplinas(nome)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-oliva">Artigos</h1>
        <Link href="/admin/artigos/novo" className={botaoPrimario}>
          + Novo artigo
        </Link>
      </div>

      {mensagem && <p className="mt-3 rounded-md border border-oliva/30 bg-oliva/10 px-4 py-2 text-sm text-oliva">{mensagem}</p>}

      <div className="mt-6 overflow-x-auto">
        <table className={tabela}>
          <thead>
            <tr>
              <th className={th}>Título</th>
              <th className={th}>Disciplina</th>
              <th className={th}>Status</th>
              <th className={th}>Visto</th>
              <th className={th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {artigos?.map((a) => (
              <tr key={a.id}>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    {a.titulo}
                    {a.is_demo && <DemoBadge />}
                  </div>
                </td>
                <td className={td}>{(a.disciplina as unknown as { nome: string } | null)?.nome ?? "—"}</td>
                <td className={td}>
                  <span className={a.status === "publicado" ? "text-oliva" : "text-cinza"}>{a.status}</span>
                </td>
                <td className={td}>{a.visualizacoes_count}</td>
                <td className={td}>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/admin/artigos/${a.id}`} className="text-oliva underline">Editar</Link>
                    <a href={`/artigos/${a.slug}`} target="_blank" rel="noreferrer" className="text-cinza underline">Ver</a>
                    <form action={alternarStatusArtigoAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="novo_status" value={a.status === "publicado" ? "rascunho" : "publicado"} />
                      <button type="submit" className="text-oliva underline">
                        {a.status === "publicado" ? "Despublicar" : "Publicar"}
                      </button>
                    </form>
                    <form action={excluirArtigoAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <ConfirmSubmitButton confirmMessage={`Excluir "${a.titulo}" para sempre?`} className="text-ocre underline">
                        Excluir
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {artigos?.length === 0 && <p className="mt-4 text-cinza">Nenhum artigo cadastrado ainda.</p>}
      </div>
    </div>
  );
}
