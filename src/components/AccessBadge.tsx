import { REGRA_ACESSO_LABELS } from "@/lib/labels";

const CORES: Record<string, string> = {
  publico: "bg-oliva/10 text-oliva border-oliva/30",
  todos_acesso_completo: "bg-oliva/10 text-oliva border-oliva/30",
  exclusivo_assinante: "bg-ocre/10 text-ocre border-ocre/30",
  exclusivo_aluno: "bg-lilas/15 text-oliva border-lilas/40",
  somente_visualizacao: "bg-areia/40 text-grafite border-areia",
  visualizacao_download: "bg-areia/40 text-grafite border-areia",
  indisponivel: "bg-cinza/10 text-cinza border-cinza/30",
};

export default function AccessBadge({ regraAcesso }: { regraAcesso: string }) {
  const cor = CORES[regraAcesso] ?? CORES.indisponivel;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cor}`}>
      {REGRA_ACESSO_LABELS[regraAcesso] ?? regraAcesso}
    </span>
  );
}
