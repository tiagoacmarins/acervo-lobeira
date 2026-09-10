import type { Metadata } from "next";
import Container from "@/components/Container";
import FiltroBar from "@/components/materiais/FiltroBar";
import MaterialCard from "@/components/materiais/MaterialCard";
import { listarMateriais } from "@/lib/data/materiais";
import { listarDisciplinas } from "@/lib/data/disciplinas";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Materiais",
  description: "Todos os materiais de estudo de Medicina Veterinária do Acervo Lobeira, organizados por disciplina.",
  alternates: { canonical: "/materiais" },
};

export default async function MateriaisPage(props: PageProps<"/materiais">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const disciplinaSlug = typeof sp.disciplina === "string" ? sp.disciplina : undefined;
  const tipo = typeof sp.tipo === "string" ? sp.tipo : undefined;

  const disciplinas = await listarDisciplinas();
  const disciplinaSelecionada = disciplinaSlug ? disciplinas.find((d) => d.slug === disciplinaSlug) : undefined;

  const materiais = await listarMateriais({
    q,
    tipo,
    disciplinaId: disciplinaSelecionada?.id,
  });

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-semibold text-oliva">Materiais</h1>
      <p className="mt-2 text-cinza">
        Resumos, apostilas, slides e mais, organizados por disciplina.
      </p>

      <div className="mt-6">
        <FiltroBar disciplinas={disciplinas} valores={{ q, disciplina: disciplinaSlug, tipo }} />
      </div>

      {materiais.length === 0 ? (
        <p className="mt-10 text-cinza">
          Nenhum material encontrado{q ? ` para "${q}"` : ""}. Tente outro termo ou outra disciplina.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materiais.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      )}
    </Container>
  );
}
