import { TIPO_MATERIAL_LABELS } from "@/lib/labels";
import type { Disciplina } from "@/lib/data/disciplinas";

export default function FiltroBar({
  disciplinas,
  valores,
}: {
  disciplinas: Disciplina[];
  valores: { q?: string; disciplina?: string; tipo?: string };
}) {
  return (
    <form
      action="/materiais"
      method="GET"
      className="flex flex-col gap-3 rounded-xl border border-areia bg-creme p-4 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        name="q"
        defaultValue={valores.q}
        placeholder="Buscar por título, assunto, palavra-chave..."
        className="flex-1 rounded-md border border-areia bg-white px-3 py-2 text-sm focus:border-oliva focus:outline-none"
      />

      <select
        name="disciplina"
        defaultValue={valores.disciplina ?? ""}
        className="rounded-md border border-areia bg-white px-3 py-2 text-sm text-grafite focus:border-oliva focus:outline-none"
      >
        <option value="">Todas as disciplinas</option>
        {disciplinas.map((d) => (
          <option key={d.slug} value={d.slug}>
            {d.nome}
          </option>
        ))}
      </select>

      <select
        name="tipo"
        defaultValue={valores.tipo ?? ""}
        className="rounded-md border border-areia bg-white px-3 py-2 text-sm text-grafite focus:border-oliva focus:outline-none"
      >
        <option value="">Todos os tipos</option>
        {Object.entries(TIPO_MATERIAL_LABELS).map(([valor, label]) => (
          <option key={valor} value={valor}>
            {label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-md bg-oliva px-5 py-2 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
      >
        Filtrar
      </button>
    </form>
  );
}
