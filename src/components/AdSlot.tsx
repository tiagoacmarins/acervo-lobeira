/**
 * Espaço reservado para anúncio (Google AdSense). O componente de
 * verdade e a ativação ficam para a Fase 6 — isto aqui só marca o
 * lugar no layout desde já, pra não precisar mexer no design depois.
 * Fica sempre desligado (nunca carrega nenhum script de anúncio)
 * enquanto não for explicitamente ativado.
 */

const TAMANHOS = {
  linha: "min-h-[100px] w-full",
  lateral: "min-h-[250px] w-full",
  quadrado: "min-h-[200px] w-full",
} as const;

export default function AdSlot({
  variante = "linha",
  className = "",
}: {
  variante?: keyof typeof TAMANHOS;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center rounded-lg border border-dashed border-cinza/40 bg-areia/20 text-xs font-medium text-cinza/70 ${TAMANHOS[variante]} ${className}`}
    >
      Espaço publicitário
    </div>
  );
}
