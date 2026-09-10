import type { Metadata } from "next";
import Container from "@/components/Container";
import DisciplinaCard from "@/components/disciplinas/DisciplinaCard";
import { listarDisciplinas } from "@/lib/data/disciplinas";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Disciplinas",
  description: "Todas as disciplinas do curso de Medicina Veterinária cobertas pelo Acervo Lobeira.",
  alternates: { canonical: "/disciplinas" },
};

export default async function DisciplinasPage() {
  const disciplinas = await listarDisciplinas();

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-semibold text-oliva">Disciplinas</h1>
      <p className="mt-2 text-cinza">Todo o Acervo, organizado pelas disciplinas do curso.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {disciplinas.map((disciplina) => (
          <DisciplinaCard key={disciplina.id} disciplina={disciplina} />
        ))}
      </div>
    </Container>
  );
}
