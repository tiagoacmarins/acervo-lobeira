import Link from "next/link";
import Container from "@/components/Container";
import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions/auth";
import { obterConfigSite } from "@/lib/data/config";

const navLinks = [
  { href: "/materiais", label: "Materiais" },
  { href: "/disciplinas", label: "Disciplinas" },
  { href: "/artigos", label: "Biblioteca de Artigos" },
];

const institucionalLinks = [
  { href: "/sobre", label: "Sobre e Missão" },
  { href: "/contato", label: "Contato" },
];

export default async function Header() {
  const supabase = await createClient();
  const [{ data }, config] = await Promise.all([supabase.auth.getUser(), obterConfigSite()]);
  const logado = !!data.user;

  return (
    <header className="relative border-b border-areia bg-creme">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className="whitespace-nowrap text-sm font-medium text-grafite transition-colors duration-200 hover:text-oliva"
          >
            Início
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-grafite transition-colors duration-200 hover:text-oliva"
            >
              {link.label}
            </Link>
          ))}

          {/* Submenu institucional (hover no desktop) */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-grafite transition-colors duration-200 hover:text-oliva"
            >
              Institucional
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="invisible absolute left-0 top-full z-20 min-w-[180px] rounded-md border border-areia bg-creme py-2 opacity-0 shadow-md transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
              {institucionalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-grafite transition-colors duration-200 hover:bg-terroso hover:text-oliva"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={config.linkCursos}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-md bg-ocre px-4 py-2 text-sm font-medium text-creme transition-colors duration-200 hover:bg-ocre/90"
          >
            Conheça nossos cursos
          </a>

          {logado ? (
            <>
              <Link
                href="/minha-conta"
                className="whitespace-nowrap rounded-md border border-oliva px-4 py-2 text-sm font-medium text-oliva transition-colors duration-200 hover:bg-terroso"
              >
                Minha conta
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="whitespace-nowrap text-sm font-medium text-cinza transition-colors duration-200 hover:text-oliva"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/entrar"
              className="whitespace-nowrap rounded-md border border-oliva px-4 py-2 text-sm font-medium text-oliva transition-colors duration-200 hover:bg-terroso"
            >
              Entrar
            </Link>
          )}
        </div>

        <MobileMenu logado={logado} linkCursos={config.linkCursos} />
      </Container>
    </header>
  );
}
