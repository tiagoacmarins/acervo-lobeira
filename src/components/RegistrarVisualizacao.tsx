"use client";

import { useEffect } from "react";

export default function RegistrarVisualizacao({ tipo, id }: { tipo: "material" | "artigo"; id: string }) {
  useEffect(() => {
    const payload = JSON.stringify({ tipo, id });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/visualizar", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/visualizar", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
    // Só uma vez, quando a página abre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
