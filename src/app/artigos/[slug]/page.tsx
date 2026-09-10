import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import DemoBadge from "@/components/DemoBadge";
import RegistrarVisualizacao from "@/components/RegistrarVisualizacao";
import FavoritoButton from "@/components/FavoritoButton";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { buscarArtigoPorSlug } from "@/lib/data/artigos";
import { createClient } from "@/lib/supabase/server";
import { articleSchema } from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(props: PageProps<"/artigos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const artigo = await buscarArtigoPorSlug(slug);
  if (!artigo) return {};
  return {
    title: artigo.titulo,
    description: artigo.pre_resumo ?? undefined,
    alternates: { canonical: `/artigos/${artigo.slug}` },
    openGraph: {
      title: artigo.titulo,
      description: artigo.pre_resumo ?? undefined,
      images: artigo.capa_url ? [artigo.capa_url] : undefined,
      type: "article",
    },
  };
}

export default async function ArtigoPage(props: PageProps<"/artigos/[slug]">) {
  const { slug } = await props.params;
  const artigo = await buscarArtigoPorSlug(slug);
  if (!artigo) notFound();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;

  let favoritadoInicial = false;
  if (userId) {
    const { data: fav } = await supabase
      .from("favoritos")
      .select("id")
      .eq("user_id", userId)
      .eq("artigo_id", artigo.id)
      .maybeSingle();
    favoritadoInicial = !!fav;
  }

  return (
    <Container className="py-12">
      <RegistrarVisualizacao tipo="artigo" id={artigo.id} />
      <JsonLd data={articleSchema(artigo, SITE_URL)} />

      <Breadcrumbs
        itens={[
          { nome: "Biblioteca de Artigos", caminho: "/artigos" },
          ...(artigo.disciplina ? [{ nome: artigo.disciplina.nome, caminho: `/disciplinas/${artigo.disciplina.slug}` }] : []),
          { nome: artigo.titulo, caminho: `/artigos/${artigo.slug}` },
        ]}
      />

      <div className="mt-4 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-oliva/30 bg-oliva/10 px-2.5 py-0.5 text-xs font-medium text-oliva">
              Acesso aberto
            </span>
            {artigo.is_demo && <DemoBadge />}
          </div>

          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-semibold text-oliva">{artigo.titulo}</h1>
            <FavoritoButton tipo="artigo" id={artigo.id} favoritadoInicial={favoritadoInicial} logado={!!userId} />
          </div>
          {artigo.subtitulo && <p className="mt-1 text-lg text-cinza">{artigo.subtitulo}</p>}

          {artigo.pre_resumo && (
            <div className="mt-6 rounded-xl border border-lilas/40 bg-lilas/10 p-5">
              <p className="font-display text-sm font-semibold text-oliva">Pré-resumo</p>
              <p className="mt-1 text-sm text-grafite">{artigo.pre_resumo}</p>
            </div>
          )}

          {artigo.resumo && (
            <div className="mt-6">
              <p className="font-display text-sm font-semibold text-oliva">Resumo completo</p>
              <p className="mt-2 whitespace-pre-line text-grafite">{artigo.resumo}</p>
            </div>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:max-w-sm">
            {artigo.autor && (
              <div>
                <dt className="text-cinza">Autoria</dt>
                <dd className="font-medium text-grafite">{artigo.autor.nome}</dd>
              </div>
            )}
            {artigo.fonte && (
              <div>
                <dt className="text-cinza">Fonte</dt>
                <dd className="font-medium text-grafite">{artigo.fonte}</dd>
              </div>
            )}
          </dl>

          {/* Reservado para anúncio — depois do resumo, antes do link para o artigo original */}
          <AdSlot variante="linha" className="mt-8" />

          {artigo.url_original && (
            <a
              href={artigo.url_original}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md bg-oliva px-5 py-2.5 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
            >
              Ler artigo original
            </a>
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
