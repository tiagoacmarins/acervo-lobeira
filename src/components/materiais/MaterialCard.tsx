import Link from "next/link";
import AccessBadge from "@/components/AccessBadge";
import DemoBadge from "@/components/DemoBadge";
import { TIPO_MATERIAL_LABELS } from "@/lib/labels";
import type { MaterialResumo } from "@/lib/data/materiais";

export default function MaterialCard({ material }: { material: MaterialResumo }) {
  return (
    <Link
      href={`/materiais/${material.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-areia bg-creme transition-colors duration-200 hover:border-lilas"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-terroso">
        {material.capa_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={material.capa_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-sm text-oliva/60">
            {TIPO_MATERIAL_LABELS[material.tipo] ?? "Material"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <AccessBadge regraAcesso={material.regra_acesso} />
          {material.is_demo && <DemoBadge />}
        </div>

        {material.disciplina && (
          <p className="text-xs font-medium uppercase tracking-wide text-ocre">{material.disciplina.nome}</p>
        )}

        <h3 className="font-display text-base font-semibold leading-snug text-oliva transition-colors duration-200 group-hover:text-oliva/80">
          {material.titulo}
        </h3>

        {material.resumo && <p className="line-clamp-2 text-sm text-cinza">{material.resumo}</p>}
      </div>
    </Link>
  );
}
