import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";
import { buscarMatriculaAtiva, listarFavoritos, listarHistorico } from "@/lib/data/conta";

export const metadata: Metadata = { title: "Minha Conta" };

export default async function MinhaContaPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/entrar");
  }

  const userId = data.user.id;

  const [{ data: perfil }, matricula, favoritos, historico] = await Promise.all([
    supabase.from("profiles").select("nome_completo, role").eq("id", userId).single(),
    buscarMatriculaAtiva(userId),
    listarFavoritos(userId),
    listarHistorico(userId),
  ]);

  return (
    <Container className="py-16">
      <h1 className="font-display text-3xl font-semibold text-oliva">Minha Conta</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-areia bg-creme p-6">
          <p className="font-display text-lg text-oliva">Perfil</p>
          <p className="mt-3 text-sm text-cinza">Nome</p>
          <p className="font-medium text-grafite">{perfil?.nome_completo || "(não informado)"}</p>
          <p className="mt-3 text-sm text-cinza">E-mail</p>
          <p className="font-medium text-grafite">{data.user.email}</p>

          <form action={signOutAction} className="mt-6">
            <button
              type="submit"
              className="rounded-md border border-oliva px-5 py-2 text-sm font-medium text-oliva transition-colors duration-200 hover:bg-terroso"
            >
              Sair
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-areia bg-creme p-6">
          <p className="font-display text-lg text-oliva">Acesso</p>

          <div className="mt-3">
            <p className="text-sm text-cinza">Matrícula em curso do Instituto</p>
            {matricula ? (
              <p className="font-medium text-oliva">
                Ativa{matricula.produto ? ` — ${matricula.produto.nome}` : ""}
              </p>
            ) : (
              <p className="font-medium text-grafite">Nenhuma matrícula ativa vinculada a esta conta.</p>
            )}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-oliva">Favoritos</h2>
        {favoritos.length === 0 ? (
          <p className="mt-2 text-cinza">Nada favoritado ainda. Clique na estrela em um material ou artigo.</p>
        ) : (
          <ul className="mt-3 divide-y divide-areia rounded-xl border border-areia bg-creme">
            {favoritos.map((f) => {
              const item = f.material
                ? { href: `/materiais/${f.material.slug}`, titulo: f.material.titulo }
                : f.artigo
                  ? { href: `/artigos/${f.artigo.slug}`, titulo: f.artigo.titulo }
                  : null;
              if (!item) return null;
              return (
                <li key={f.id}>
                  <Link href={item.href} className="block px-4 py-3 text-sm text-grafite transition-colors duration-200 hover:bg-terroso hover:text-oliva">
                    {item.titulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-oliva">Histórico recente</h2>
        {historico.length === 0 ? (
          <p className="mt-2 text-cinza">Você ainda não abriu nenhum material ou artigo.</p>
        ) : (
          <ul className="mt-3 divide-y divide-areia rounded-xl border border-areia bg-creme">
            {historico.map((h) => {
              const item = h.material
                ? { href: `/materiais/${h.material.slug}`, titulo: h.material.titulo }
                : h.artigo
                  ? { href: `/artigos/${h.artigo.slug}`, titulo: h.artigo.titulo }
                  : null;
              if (!item) return null;
              return (
                <li key={h.id}>
                  <Link href={item.href} className="block px-4 py-3 text-sm text-grafite transition-colors duration-200 hover:bg-terroso hover:text-oliva">
                    {item.titulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Container>
  );
}
