// Classes Tailwind reaproveitadas nos formulários do painel, pra não
// repetir a mesma string gigante em cada campo.
export const campoLabel = "flex flex-col gap-1 text-sm text-grafite";
export const campoInput =
  "rounded-md border border-areia bg-white px-3 py-2 text-sm focus:border-oliva focus:outline-none";
export const campoTextarea = campoInput + " min-h-[100px]";
export const botaoPrimario =
  "rounded-md bg-oliva px-5 py-2.5 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90 disabled:opacity-60";
export const botaoSecundario =
  "rounded-md border border-oliva px-5 py-2.5 text-sm font-medium text-oliva transition-colors duration-200 hover:bg-terroso";
export const botaoPerigo =
  "rounded-md border border-ocre px-4 py-2 text-sm font-medium text-ocre transition-colors duration-200 hover:bg-ocre/10";
export const tabela = "w-full border-collapse text-sm";
export const th = "border-b border-areia px-3 py-2 text-left font-display text-oliva";
export const td = "border-b border-areia px-3 py-2 align-top";
