import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import MaterialCard from "@/components/materiais/MaterialCard";
import ArtigoCard from "@/components/artigos/ArtigoCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buscarDisciplinaPorSlug } from "@/lib/data/disciplinas";
import { listarMateriais } from "@/lib/data/materiais";
import { listarArtigos } from "@/lib/data/artigos";

export const revalidate = 60;

export async function generateMetadata(props: PageProps<"/disciplinas/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const disciplina = await buscarDisciplinaPorSlug(slug);
  if (!disciplina) return {};
  return {
    title: disciplina.nome,
    description: disciplina.descricao ?? `Materiais e artigos de ${disciplina.nome} no Acervo Lobeira.`,
    alternates: { canonical: `/disciplinas/${disciplina.slug}` },
  };
}

export default async function DisciplinaPage(props: PageProps<"/disciplinas/[slug]">) {
  const { slug } = await props.params;
  const disciplina = await buscarDisciplinaPorSlug(slug);
  if (!disciplina) notFound();

  const [materiais, artigos] = await Promise.all([
    listarMateriais({ disciplinaId: disciplina.id }),
    listarArtigos({ disciplinaId: disciplina.id }),
  ]);

  return (
    <Container className="py-12">
      <Breadcrumbs
        itens={[
          { nome: "Disciplinas", caminho: "/disciplinas" },
          { nome: disciplina.nome, caminho: `/disciplinas/${disciplina.slug}` },
        ]}
      />
      <h1 className="mt-3 font-display text-3xl font-semibold text-oliva">{disciplina.nome}</h1>
      {disciplina.descricao && <p className="mt-2 max-w-2xl text-cinza">{disciplina.descricao}</p>}

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-oliva">Materiais</h2>
        {materiais.length === 0 ? (
          <p className="mt-3 text-cinza">Ainda não há materiais publicados nesta disciplina.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {materiais.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </section>

      {artigos.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-oliva">Artigos</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {artigos.map((artigo) => (
              <ArtigoCard key={artigo.id} artigo={artigo} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
