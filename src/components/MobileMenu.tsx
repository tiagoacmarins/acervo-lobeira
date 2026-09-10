"use client";

import { useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";

const links = [
  { href: "/", label: "Início" },
  { href: "/materiais", label: "Materiais" },
  { href: "/disciplinas", label: "Disciplinas" },
  { href: "/artigos", label: "Biblioteca de Artigos" },
  { href: "/sobre", label: "Sobre o Instituto" },
  { href: "/contato", label: "Contato" },
];

export default function MobileMenu({ logado, linkCursos }: { logado: boolean; linkCursos: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-oliva transition-colors duration-200 hover:bg-terroso"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-areia bg-creme shadow-sm">
          <nav className="flex flex-col px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 font-medium text-grafite transition-colors duration-200 hover:bg-terroso"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={linkCursos}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-ocre px-3 py-2.5 text-center font-medium text-creme transition-colors duration-200 hover:bg-ocre/90"
            >
              Conheça nossos cursos
            </a>
            {logado ? (
              <>
                <Link
                  href="/minha-conta"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-md border border-oliva px-3 py-2.5 text-center font-medium text-oliva transition-colors duration-200 hover:bg-terroso"
                >
                  Minha conta
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-md px-3 py-2.5 text-center font-medium text-cinza transition-colors duration-200 hover:text-oliva"
                  >
                    Sair
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/entrar"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-md border border-oliva px-3 py-2.5 text-center font-medium text-oliva transition-colors duration-200 hover:bg-terroso"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
