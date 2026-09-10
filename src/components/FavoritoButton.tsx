"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function FavoritoButton({
  tipo,
  id,
  favoritadoInicial,
  logado,
}: {
  tipo: "material" | "artigo";
  id: string;
  favoritadoInicial: boolean;
  logado: boolean;
}) {
  const [favoritado, setFavoritado] = useState(favoritadoInicial);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!logado) {
    return (
      <button
        type="button"
        onClick={() => router.push("/entrar")}
        className="inline-flex items-center gap-1.5 rounded-md border border-areia px-3 py-1.5 text-sm text-cinza transition-colors duration-200 hover:border-oliva hover:text-oliva"
      >
        ☆ Favoritar
      </button>
    );
  }

  function alternar() {
    const proximo = !favoritado;
    setFavoritado(proximo); // otimista
    startTransition(async () => {
      try {
        const res = await fetch("/api/favoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tipo, id }),
        });
        if (!res.ok) setFavoritado(!proximo); // desfaz se deu erro
      } catch {
        setFavoritado(!proximo);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={alternar}
      disabled={pending}
      aria-pressed={favoritado}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 disabled:opacity-60 ${
        favoritado
          ? "border-ocre bg-ocre/10 text-ocre"
          : "border-areia text-cinza hover:border-oliva hover:text-oliva"
      }`}
    >
      {favoritado ? "★ Favoritado" : "☆ Favoritar"}
    </button>
  );
}
