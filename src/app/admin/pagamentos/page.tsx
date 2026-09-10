import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { salvarMapeamentoProdutoAction, simularEventoAction } from "@/lib/actions/admin-pagamentos";
import { campoLabel, campoInput, botaoPrimario, tabela, th, td } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Pagamentos · Admin" };
export const dynamic = "force-dynamic";

const TIPOS_EVENTO = [
  { valor: "compra_aprovada", label: "Compra aprovada (libera acesso)" },
  { valor: "subscription_renewed", label: "Assinatura renovada (libera acesso)" },
  { valor: "subscription_late", label: "Assinatura atrasada (marca inadimplente)" },
  { valor: "subscription_canceled", label: "Assinatura cancelada (revoga acesso)" },
  { valor: "compra_reembolsada", label: "Compra reembolsada (revoga acesso)" },
  { valor: "chargeback", label: "Chargeback (revoga acesso)" },
  { valor: "compra_recusada", label: "Compra recusada (não faz nada)" },
];

export default async function AdminPagamentosPage(props: PageProps<"/admin/pagamentos">) {
  const sp = await props.searchParams;
  const mensagem = typeof sp.mensagem === "string" ? sp.mensagem : undefined;
  const erro = typeof sp.erro === "string" ? sp.erro : undefined;

  const supabase = await createClient();
  const [{ data: planos }, { data: produtos }, { data: eventos }] = await Promise.all([
    supabase.from("planos").select("id, nome, provider_product_id").order("nome"),
    supabase.from("produtos_elegiveis").select("id, nome, provider_product_id").order("nome"),
    supabase.from("webhook_events").select("id, provider, tipo_evento, status, created_at").order("created_at", { ascending: false }).limit(30),
  ]);

  const tokenConfigurado = !!process.env.KIWIFY_WEBHOOK_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">Pagamentos (Kiwify)</h1>
      <p className="mt-1 text-sm text-cinza">
        Enquanto a conta da Kiwify não está pronta, use &ldquo;Conceder/revogar manualmente&rdquo; e
        &ldquo;Importar CSV&rdquo; em <Link href="/admin/usuarios" className="underline">Usuários</Link>, ou simule
        eventos aqui embaixo pra testar o fluxo inteiro.
      </p>

      {mensagem && <p className="mt-3 rounded-md border border-oliva/30 bg-oliva/10 px-4 py-2 text-sm text-oliva">{mensagem}</p>}
      {erro && <p className="mt-3 rounded-md border border-ocre/30 bg-ocre/10 px-4 py-2 text-sm text-ocre">{erro}</p>}

      <div className="mt-6 rounded-xl border border-areia bg-creme p-5">
        <p className="font-display text-lg text-oliva">Status da integração</p>
        <p className="mt-2 text-sm text-grafite">
          Token de segurança (KIWIFY_WEBHOOK_TOKEN):{" "}
          {tokenConfigurado ? <span className="text-oliva">configurado ✓</span> : <span className="text-ocre">PENDENTE — sem token, o endpoint recusa tudo</span>}
        </p>
        <p className="mt-1 text-sm text-grafite">
          Quando tiver a conta Kiwify, configure o webhook apontando para:
        </p>
        <code className="mt-1 block break-all rounded-md bg-terroso px-3 py-2 text-xs text-grafite">
          {siteUrl}/api/webhooks/kiwify?token=SEU_TOKEN
        </code>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-areia bg-creme p-5">
          <p className="font-display text-lg text-oliva">Mapear planos → produto Kiwify</p>
          <p className="mt-1 text-sm text-cinza">Cole aqui o ID do produto na Kiwify quando existir.</p>
          <div className="mt-4 space-y-3">
            {planos?.map((p) => (
              <form key={p.id} action={salvarMapeamentoProdutoAction} className="flex items-center gap-2">
                <input type="hidden" name="tipo" value="plano" />
                <input type="hidden" name="id" value={p.id} />
                <span className="w-40 shrink-0 text-sm text-grafite">{p.nome}</span>
                <input name="provider_product_id" defaultValue={p.provider_product_id ?? ""} placeholder="ID do produto Kiwify" className={campoInput + " flex-1"} />
                <button type="submit" className="text-xs text-oliva underline">Salvar</button>
              </form>
            ))}
            {(!planos || planos.length === 0) && <p className="text-sm text-cinza">Nenhum plano cadastrado (veja Configurações).</p>}
          </div>
        </div>

        <div className="rounded-xl border border-areia bg-creme p-5">
          <p className="font-display text-lg text-oliva">Mapear cursos → produto Kiwify</p>
          <p className="mt-1 text-sm text-cinza">Idem, para os cursos elegíveis (matrícula de aluno).</p>
          <div className="mt-4 space-y-3">
            {produtos?.map((p) => (
              <form key={p.id} action={salvarMapeamentoProdutoAction} className="flex items-center gap-2">
                <input type="hidden" name="tipo" value="produto" />
                <input type="hidden" name="id" value={p.id} />
                <span className="w-40 shrink-0 text-sm text-grafite">{p.nome}</span>
                <input name="provider_product_id" defaultValue={p.provider_product_id ?? ""} placeholder="ID do produto Kiwify" className={campoInput + " flex-1"} />
                <button type="submit" className="text-xs text-oliva underline">Salvar</button>
              </form>
            ))}
            {(!produtos || produtos.length === 0) && <p className="text-sm text-cinza">Nenhum curso cadastrado (veja Usuários e assinaturas).</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-areia bg-creme p-5">
        <p className="font-display text-lg text-oliva">Simular um evento</p>
        <p className="mt-1 text-sm text-cinza">
          Dispara o mesmo processamento de um webhook real, sem precisar da Kiwify — bom pra testar
          antes de ter a conta. Fica registrado separado dos eventos de verdade.
        </p>
        <form action={simularEventoAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <label className={campoLabel}>
            Tipo de evento
            <select name="tipo" required className={campoInput}>
              {TIPOS_EVENTO.map((t) => (
                <option key={t.valor} value={t.valor}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className={campoLabel}>
            E-mail do cliente (precisa ter conta no site)
            <input type="email" name="email" required className={campoInput} />
          </label>
          <label className={campoLabel}>
            ID do produto Kiwify (para compra/renovação)
            <input name="provider_product_id" className={campoInput} />
          </label>
          <button type="submit" className={botaoPrimario + " self-end"}>Simular</button>
        </form>
      </div>

      <div className="mt-8">
        <p className="font-display text-lg text-oliva">Últimos eventos</p>
        <div className="mt-3 overflow-x-auto">
          <table className={tabela}>
            <thead>
              <tr>
                <th className={th}>Quando</th>
                <th className={th}>Origem</th>
                <th className={th}>Evento</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {eventos?.map((e) => (
                <tr key={e.id}>
                  <td className={td}>{new Date(e.created_at).toLocaleString("pt-BR")}</td>
                  <td className={td}>{e.provider === "kiwify_simulado" ? "Simulado" : "Kiwify (real)"}</td>
                  <td className={td}>{e.tipo_evento}</td>
                  <td className={td}>{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {eventos?.length === 0 && <p className="mt-3 text-sm text-cinza">Nenhum evento ainda.</p>}
        </div>
      </div>
    </div>
  );
}
