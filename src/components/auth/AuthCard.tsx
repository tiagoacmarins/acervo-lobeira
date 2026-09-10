import type { ReactNode } from "react";
import Container from "@/components/Container";

export default function AuthCard({
  titulo,
  subtitulo,
  erro,
  mensagem,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  erro?: string;
  mensagem?: string;
  children: ReactNode;
}) {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-2xl border border-areia bg-creme p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-oliva">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-sm text-cinza">{subtitulo}</p>}

        {erro && (
          <p className="mt-4 rounded-md border border-ocre/30 bg-ocre/10 px-3 py-2 text-sm text-ocre">
            {erro}
          </p>
        )}
        {mensagem && (
          <p className="mt-4 rounded-md border border-oliva/30 bg-oliva/10 px-3 py-2 text-sm text-oliva">
            {mensagem}
          </p>
        )}

        <div className="mt-6">{children}</div>
      </div>
    </Container>
  );
}
