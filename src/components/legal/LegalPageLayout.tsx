import type { ReactNode } from "react";
import Container from "@/components/Container";
import AvisoRevisaoLegal from "@/components/legal/AvisoRevisaoLegal";

export default function LegalPageLayout({
  titulo,
  atualizadoEm,
  children,
}: {
  titulo: string;
  atualizadoEm?: string;
  children: ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold text-oliva">{titulo}</h1>
      {atualizadoEm && <p className="mt-1 text-sm text-cinza">Última atualização: {atualizadoEm}</p>}

      <div className="mt-6">
        <AvisoRevisaoLegal />
      </div>

      <div className="space-y-4 text-grafite [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-oliva [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
    </Container>
  );
}
