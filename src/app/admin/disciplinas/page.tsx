import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { salvarDisciplinaAction, excluirDisciplinaAction } from "@/lib/actions/admin-disciplinas";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { campoLabel, campoInput, botaoPrimario, tabela, th, td } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Disciplinas · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDisciplinasPage(props: PageProps<"/admin/disciplinas">) {
  const sp = await props.searchParams;
  const erro = typeof sp.erro === "string" ? sp.erro : undefined;
  const mensagem = typeof sp.mensagem === "string" ? sp.mensagem : undefined;
  const editandoId = typeof sp.editar === "string" ? sp.editar : undefined;

  const supabase = await createClient();
  const { data: disciplinas } = await supabase.from("disciplinas").select("*").order("ordem");
  const editando = editandoId ? disciplinas?.find((d) => d.id === editandoId) : undefined;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">Disciplinas</h1>

      {erro && <p className="mt-3 rounded-md border border-ocre/30 bg-ocre/10 px-4 py-2 text-sm text-ocre">{erro}</p>}
      {mensagem && <p className="mt-3 rounded-md border border-oliva/30 bg-oliva/10 px-4 py-2 text-sm text-oliva">{mensagem}</p>}

      <form action={salvarDisciplinaAction} className="mt-6 grid gap-3 rounded-xl border border-areia bg-creme p-5 sm:grid-cols-[2fr_3fr_100px_auto]">
        <input type="hidden" name="id" defaultValue={editando?.id ?? ""} />
        <label className={campoLabel}>
          Nome
          <input name="nome" defaultValue={editando?.nome ?? ""} required className={campoInput} />
        </label>
        <label className={campoLabel}>
          Descrição (opcional)
          <input name="descricao" defaultValue={editando?.descricao ?? ""} className={campoInput} />
        </label>
        <label className={campoLabel}>
          Ordem
          <input type="number" name="ordem" defaultValue={editando?.ordem ?? 0} className={campoInput} />
        </label>
        <button type="submit" className={botaoPrimario + " self-end"}>
          {editando ? "Salvar" : "+ Adicionar"}
        </button>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className={tabela}>
          <thead>
            <tr>
              <th className={th}>Ordem</th>
              <th className={th}>Nome</th>
              <th className={th}>Slug</th>
              <th className={th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas?.map((d) => (
              <tr key={d.id}>
                <td className={td}>{d.ordem}</td>
                <td className={td}>{d.nome}</td>
                <td className={td}>
                  <code className="text-xs text-cinza">{d.slug}</code>
                </td>
                <td className={td}>
                  <div className="flex gap-3">
                    <a href={`/admin/disciplinas?editar=${d.id}`} className="text-oliva underline">
                      Editar
                    </a>
                    <form action={excluirDisciplinaAction}>
                      <input type="hidden" name="id" value={d.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`Excluir a disciplina "${d.nome}"? Materiais/artigos dessa disciplina não são apagados, só perdem a categoria.`}
                        className="text-ocre underline"
                      >
                        Excluir
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
