import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listarUsuariosAdmin } from "@/lib/admin/usuarios";
import {
  alterarRoleAction,
  concederAssinaturaAction,
  revogarAssinaturaAction,
  criarProdutoElegivelAction,
  concederMatriculaAction,
  revogarMatriculaAction,
  importarAssinantesCsvAction,
} from "@/lib/actions/admin-usuarios";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { campoLabel, campoInput, botaoPrimario, botaoSecundario, tabela, th, td } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Usuários · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage(props: PageProps<"/admin/usuarios">) {
  const sp = await props.searchParams;
  const mensagem = typeof sp.mensagem === "string" ? sp.mensagem : undefined;
  const erro = typeof sp.erro === "string" ? sp.erro : undefined;

  const [usuarios, supabase] = await Promise.all([listarUsuariosAdmin(), createClient()]);
  const { data: produtosElegiveis } = await supabase.from("produtos_elegiveis").select("id, nome").order("nome");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">Usuários e assinaturas</h1>

      {mensagem && <p className="mt-3 rounded-md border border-oliva/30 bg-oliva/10 px-4 py-2 text-sm text-oliva">{mensagem}</p>}
      {erro && <p className="mt-3 rounded-md border border-ocre/30 bg-ocre/10 px-4 py-2 text-sm text-ocre">{erro}</p>}

      <div className="mt-6 overflow-x-auto">
        <table className={tabela}>
          <thead>
            <tr>
              <th className={th}>Usuário</th>
              <th className={th}>Papel</th>
              <th className={th}>Assinatura</th>
              <th className={th}>Matrícula</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className={td}>
                  <p className="font-medium text-grafite">{u.nome ?? "(sem nome)"}</p>
                  <p className="text-xs text-cinza">{u.email}</p>
                </td>
                <td className={td}>
                  <form action={alterarRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="user_id" value={u.id} />
                    <select name="role" defaultValue={u.role} className={campoInput + " py-1"}>
                      <option value="usuario">Usuário</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="text-xs text-oliva underline">Salvar</button>
                  </form>
                </td>
                <td className={td}>
                  {u.assinaturaAtiva ? (
                    <div className="flex items-center gap-2">
                      <span className="text-oliva">Ativa</span>
                      <form action={revogarAssinaturaAction}>
                        <input type="hidden" name="user_id" value={u.id} />
                        <ConfirmSubmitButton confirmMessage="Revogar a assinatura deste usuário?" className="text-xs text-ocre underline">
                          Revogar
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  ) : (
                    <form action={concederAssinaturaAction} className="flex items-center gap-2">
                      <input type="hidden" name="user_id" value={u.id} />
                      <input type="hidden" name="dias" value="30" />
                      <button type="submit" className="text-xs text-oliva underline">Conceder (30 dias)</button>
                    </form>
                  )}
                </td>
                <td className={td}>
                  {u.matriculaAtiva ? (
                    <div className="flex items-center gap-2">
                      <span className="text-oliva">Ativa</span>
                      <form action={revogarMatriculaAction}>
                        <input type="hidden" name="user_id" value={u.id} />
                        <ConfirmSubmitButton confirmMessage="Revogar a matrícula deste usuário?" className="text-xs text-ocre underline">
                          Revogar
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  ) : produtosElegiveis && produtosElegiveis.length > 0 ? (
                    <form action={concederMatriculaAction} className="flex items-center gap-1">
                      <input type="hidden" name="user_id" value={u.id} />
                      <select name="produto_elegivel_id" className={campoInput + " py-1"} required>
                        <option value="">Curso...</option>
                        {produtosElegiveis.map((p) => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                      <button type="submit" className="text-xs text-oliva underline">Conceder</button>
                    </form>
                  ) : (
                    <span className="text-xs text-cinza">Cadastre um curso elegível abaixo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-areia bg-creme p-5">
          <p className="font-display text-lg text-oliva">Cursos elegíveis</p>
          <p className="mt-1 text-sm text-cinza">
            Cursos do Instituto cuja matrícula ativa já dá acesso completo ao Acervo.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {produtosElegiveis?.map((p) => <li key={p.id}>• {p.nome}</li>)}
            {(!produtosElegiveis || produtosElegiveis.length === 0) && <li className="text-cinza">Nenhum cadastrado ainda.</li>}
          </ul>
          <form action={criarProdutoElegivelAction} className="mt-4 flex gap-2">
            <input name="nome" placeholder="Nome do curso" required className={campoInput + " flex-1"} />
            <button type="submit" className={botaoSecundario}>+ Adicionar</button>
          </form>
        </div>

        <div className="rounded-xl border border-areia bg-creme p-5">
          <p className="font-display text-lg text-oliva">Importar assinantes por CSV</p>
          <p className="mt-1 text-sm text-cinza">
            Um e-mail por linha (a pessoa precisa já ter uma conta criada no site).
          </p>
          <form action={importarAssinantesCsvAction} encType="multipart/form-data" className="mt-4 grid gap-3">
            <label className={campoLabel}>
              Arquivo CSV
              <input type="file" name="csv" accept=".csv,text/csv" required className={campoInput} />
            </label>
            <label className={campoLabel}>
              Duração (dias)
              <input type="number" name="dias" defaultValue={30} className={campoInput} />
            </label>
            <button type="submit" className={botaoPrimario + " w-fit"}>Importar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
