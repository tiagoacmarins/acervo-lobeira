import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { alternarStatusMaterialAction, excluirMaterialAction } from "@/lib/actions/admin-materiais";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import DemoBadge from "@/components/DemoBadge";
import { REGRA_ACESSO_LABELS, TIPO_MATERIAL_LABELS } from "@/lib/labels";
import { botaoPrimario, tabela, th, td } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Materiais · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminMateriaisPage(props: PageProps<"/admin/materiais">) {
  const sp = await props.searchParams;
  const mensagem = typeof sp.mensagem === "string" ? sp.mensagem : undefined;

  const supabase = await createClient();
  const { data: materiais } = await supabase
    .from("materiais")
    .select("id,slug,titulo,tipo,regra_acesso,status,is_demo,visualizacoes_count,disciplina:disciplinas(nome)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-oliva">Materiais</h1>
        <Link href="/admin/materiais/novo" className={botaoPrimario}>
          + Novo material
        </Link>
      </div>

      {mensagem && <p className="mt-3 rounded-md border border-oliva/30 bg-oliva/10 px-4 py-2 text-sm text-oliva">{mensagem}</p>}

      <div className="mt-6 overflow-x-auto">
        <table className={tabela}>
          <thead>
            <tr>
              <th className={th}>Título</th>
              <th className={th}>Disciplina</th>
              <th className={th}>Tipo</th>
              <th className={th}>Acesso</th>
              <th className={th}>Status</th>
              <th className={th}>Visto</th>
              <th className={th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {materiais?.map((m) => (
              <tr key={m.id}>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    {m.titulo}
                    {m.is_demo && <DemoBadge />}
                  </div>
                </td>
                <td className={td}>{(m.disciplina as unknown as { nome: string } | null)?.nome ?? "—"}</td>
                <td className={td}>{TIPO_MATERIAL_LABELS[m.tipo] ?? m.tipo}</td>
                <td className={td}>{REGRA_ACESSO_LABELS[m.regra_acesso] ?? m.regra_acesso}</td>
                <td className={td}>
                  <span className={m.status === "publicado" ? "text-oliva" : "text-cinza"}>{m.status}</span>
                </td>
                <td className={td}>{m.visualizacoes_count}</td>
                <td className={td}>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/admin/materiais/${m.id}`} className="text-oliva underline">
                      Editar
                    </Link>
                    <a href={`/materiais/${m.slug}`} target="_blank" rel="noreferrer" className="text-cinza underline">
                      Ver
                    </a>
                    <form action={alternarStatusMaterialAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="novo_status" value={m.status === "publicado" ? "rascunho" : "publicado"} />
                      <button type="submit" className="text-oliva underline">
                        {m.status === "publicado" ? "Despublicar" : "Publicar"}
                      </button>
                    </form>
                    <form action={excluirMaterialAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmSubmitButton confirmMessage={`Excluir "${m.titulo}" para sempre?`} className="text-ocre underline">
                        Excluir
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {materiais?.length === 0 && <p className="mt-4 text-cinza">Nenhum material cadastrado ainda.</p>}
      </div>
    </div>
  );
}
