import Link from "next/link";
import DemoBadge from "@/components/DemoBadge";
import type { ArtigoResumo } from "@/lib/data/artigos";

export default function ArtigoCard({ artigo }: { artigo: ArtigoResumo }) {
  return (
    <Link
      href={`/artigos/${artigo.slug}`}
      className="group flex flex-col gap-2 rounded-xl border border-areia bg-creme p-5 transition-colors duration-200 hover:border-lilas"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-full border border-oliva/30 bg-oliva/10 px-2.5 py-0.5 text-xs font-medium text-oliva">
          Acesso aberto
        </span>
        {artigo.is_demo && <DemoBadge />}
      </div>

      {artigo.disciplina && (
        <p className="text-xs font-medium uppercase tracking-wide text-ocre">{artigo.disciplina.nome}</p>
      )}

      <h3 className="font-display text-lg font-semibold leading-snug text-oliva transition-colors duration-200 group-hover:text-oliva/80">
        {artigo.titulo}
      </h3>

      {artigo.pre_resumo && <p className="line-clamp-2 text-sm text-cinza">{artigo.pre_resumo}</p>}
    </Link>
  );
}
