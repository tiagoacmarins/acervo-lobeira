import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { tabela, th, td } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Auditoria · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminAuditoriaPage() {
  const supabase = await createClient();
  const { data: registros } = await supabase
    .from("auditoria")
    .select("id, acao, entidade, entidade_id, created_at, user:profiles(nome_completo)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">Auditoria</h1>
      <p className="mt-1 text-sm text-cinza">Últimas 200 ações feitas no painel administrativo.</p>

      <div className="mt-6 overflow-x-auto">
        <table className={tabela}>
          <thead>
            <tr>
              <th className={th}>Quando</th>
              <th className={th}>Quem</th>
              <th className={th}>Ação</th>
              <th className={th}>Onde</th>
            </tr>
          </thead>
          <tbody>
            {registros?.map((r) => (
              <tr key={r.id}>
                <td className={td}>{new Date(r.created_at).toLocaleString("pt-BR")}</td>
                <td className={td}>{(r.user as unknown as { nome_completo: string | null } | null)?.nome_completo ?? "—"}</td>
                <td className={td}>{r.acao}</td>
                <td className={td}>
                  {r.entidade}
                  {r.entidade_id ? ` · ${r.entidade_id.slice(0, 8)}…` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registros?.length === 0 && <p className="mt-4 text-cinza">Nenhuma ação registrada ainda.</p>}
      </div>
    </div>
  );
}
