import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { marcarMensagemRespondidaAction } from "@/lib/actions/admin-mensagens";
import { tabela, th, td } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Mensagens · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminMensagensPage() {
  const supabase = await createClient();
  const { data: mensagens } = await supabase
    .from("mensagens_contato")
    .select("id, nome, email, assunto, mensagem, respondido, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">Mensagens de contato</h1>
      <p className="mt-1 text-sm text-cinza">Inclui o formulário de contato e o de solicitação de remoção.</p>

      <div className="mt-6 overflow-x-auto">
        <table className={tabela}>
          <thead>
            <tr>
              <th className={th}>Quando</th>
              <th className={th}>De</th>
              <th className={th}>Assunto</th>
              <th className={th}>Mensagem</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mensagens?.map((m) => (
              <tr key={m.id} className={m.respondido ? "opacity-60" : undefined}>
                <td className={td}>{new Date(m.created_at).toLocaleString("pt-BR")}</td>
                <td className={td}>
                  <p className="font-medium text-grafite">{m.nome}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-oliva underline">{m.email}</a>
                </td>
                <td className={td}>{m.assunto ?? "—"}</td>
                <td className={td + " max-w-sm"}>{m.mensagem}</td>
                <td className={td}>
                  {m.respondido ? (
                    <span className="text-cinza">Respondida</span>
                  ) : (
                    <form action={marcarMensagemRespondidaAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <button type="submit" className="text-oliva underline">Marcar como respondida</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mensagens?.length === 0 && <p className="mt-4 text-cinza">Nenhuma mensagem recebida ainda.</p>}
      </div>
    </div>
  );
}
