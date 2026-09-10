import Link from "next/link";
import type { Disciplina } from "@/lib/data/disciplinas";

export default function DisciplinaCard({ disciplina }: { disciplina: Disciplina }) {
  return (
    <Link
      href={`/disciplinas/${disciplina.slug}`}
      className="rounded-lg border border-areia bg-creme p-4 text-center text-sm font-medium text-grafite transition-colors duration-200 hover:border-lilas hover:text-oliva"
    >
      {disciplina.nome}
    </Link>
  );
}
