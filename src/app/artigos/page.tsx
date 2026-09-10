import type { Metadata } from "next";
import { Fragment } from "react";
import Container from "@/components/Container";
import ArtigoCard from "@/components/artigos/ArtigoCard";
import AdSlot from "@/components/AdSlot";
import { listarArtigos } from "@/lib/data/artigos";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Biblioteca de Artigos",
  description: "Artigos de acesso aberto sobre Medicina Veterinária, com pré-resumo para estudo.",
  alternates: { canonical: "/artigos" },
};

// A cada quantos cards entra uma faixa de anúncio na listagem.
const INTERVALO_ANUNCIO = 4;

export default async function ArtigosPage(props: PageProps<"/artigos">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;

  const artigos = await listarArtigos({ q });

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-semibold text-oliva">Biblioteca de Artigos</h1>
      <p className="mt-2 max-w-2xl text-cinza">
        Artigos de acesso aberto sobre temas de Medicina Veterinária, cada um com um pré-resumo
        para você decidir rápido se vale a leitura completa. Sempre gratuita, sem exclusividade.
      </p>

      <form action="/artigos" method="GET" className="mt-6 flex max-w-md gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar artigo por título ou assunto..."
          className="flex-1 rounded-md border border-areia bg-creme px-3 py-2 text-sm focus:border-oliva focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-oliva px-5 py-2 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
        >
          Buscar
        </button>
      </form>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div>
          {artigos.length === 0 ? (
            <p className="text-cinza">Nenhum artigo encontrado{q ? ` para "${q}"` : ""}.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {artigos.map((artigo, i) => (
                <Fragment key={artigo.id}>
                  <ArtigoCard artigo={artigo} />
                  {(i + 1) % INTERVALO_ANUNCIO === 0 && i + 1 < artigos.length && (
                    <div className="sm:col-span-2">
                      <AdSlot variante="linha" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <AdSlot variante="lateral" />
          </div>
        </aside>
      </div>
    </Container>
  );
}
