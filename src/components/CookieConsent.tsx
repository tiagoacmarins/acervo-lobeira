"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CHAVE = "acervo-lobeira:cookies-aceitos";

export default function CookieConsent() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lendo um sistema externo (localStorage) na montagem: é exatamente o uso pretendido de efeito.
      if (!localStorage.getItem(CHAVE)) setVisivel(true);
    } catch {
      // Se o navegador bloquear localStorage (aba anônima restrita etc.),
      // simplesmente não mostra o aviso — não é crítico.
    }
  }, []);

  function aceitar() {
    try {
      localStorage.setItem(CHAVE, "1");
    } catch {
      // idem — segue o jogo mesmo se não conseguir salvar.
    }
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-areia bg-creme/97 px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-grafite">
          Usamos cookies essenciais para o site funcionar (como manter você logado). Saiba mais na
          nossa{" "}
          <Link href="/cookies" className="underline">
            política de cookies
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={aceitar}
          className="shrink-0 rounded-md bg-oliva px-5 py-2 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
