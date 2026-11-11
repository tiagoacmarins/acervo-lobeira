import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import FlorLilas from "@/components/FlorLilas";
import DisciplinaCard from "@/components/disciplinas/DisciplinaCard";
import MaterialCard from "@/components/materiais/MaterialCard";
import ArtigoCard from "@/components/artigos/ArtigoCard";
import { obterConfigSite } from "@/lib/data/config";
import { listarDisciplinas } from "@/lib/data/disciplinas";
import { listarMateriais } from "@/lib/data/materiais";
import { listarArtigos } from "@/lib/data/artigos";

export const revalidate = 60;
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [SITE, disciplinas, ultimasPublicacoes, maisAcessados, ultimosArtigos] = await Promise.all([
    obterConfigSite(),
    listarDisciplinas(),
    listarMateriais({ limit: 8, ordenarPor: "recentes" }),
    listarMateriais({ limit: 4, ordenarPor: "acessados" }),
    listarArtigos({ limit: 2 }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-areia">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-cerrado.png)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-creme/85" aria-hidden />

        <Container className="relative grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-lavanda/40 px-3 py-1 text-xs font-medium text-oliva">
              Instituto Lobeira de Ensino
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-oliva sm:text-5xl">
              Materiais de estudo para quem estuda Medicina Veterinária
            </h1>
            <p className="mt-5 max-w-lg text-lg text-cinza">
              Resumos, apostilas e artigos organizados por disciplina, pensados
              para quem quer entender de verdade, não só passar na prova.
            </p>
            <p className="mt-4 font-display text-lg text-ocre">
              &ldquo;{SITE.assinaturaEditorial}&rdquo;
            </p>

            <form
              action="/materiais"
              method="GET"
              className="mt-8 flex max-w-md items-center gap-1.5 rounded-full border border-areia bg-creme/95 p-1.5 shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="ml-2 h-5 w-5 shrink-0 text-cinza"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M20 20l-4.5-4.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                name="q"
                placeholder="O que vamos estudar hoje?"
                className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm text-grafite placeholder:text-cinza focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-oliva px-4 py-2 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
              >
                Buscar
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/materiais"
                className="rounded-md bg-oliva px-6 py-3 font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
              >
                Explorar materiais
              </Link>
              <Link
                href="/registrar"
                className="rounded-md border border-ocre px-6 py-3 font-medium text-ocre transition-colors duration-200 hover:bg-terroso"
              >
                Criar conta grátis
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-lilas/25 blur-2xl" aria-hidden />
            <div className="relative rounded-2xl border border-areia bg-terroso p-8 shadow-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-oliva px-3 py-1 text-xs font-semibold text-creme">
                <FlorLilas className="h-3.5 w-3.5 text-lilas" />
                Antídoto
              </span>
              <p className="mt-4 font-display text-xl text-oliva">
                O que você não pode esquecer
              </p>
              <p className="mt-2 text-sm text-grafite">
                Em cada material, os pontos marcados com o selo{" "}
                <strong>Antídoto</strong> reúnem o que mais cai em prova e o que
                mais se confunde na prática clínica.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Últimas publicações */}
      {ultimasPublicacoes.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-oliva">Últimas publicações</h2>
              <Link href="/materiais" className="text-sm font-medium text-oliva transition-colors duration-200 hover:underline">
                Ver todos os materiais
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ultimasPublicacoes.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Mais acessados */}
      {maisAcessados.length > 0 && (
        <section className="border-t border-areia bg-terroso/40 py-16">
          <Container>
            <h2 className="font-display text-2xl font-semibold text-oliva">Mais acessados</h2>
            <p className="mt-2 text-cinza">O que mais tem ajudado outros estudantes.</p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {maisAcessados.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Explore por disciplina */}
      <section className="py-16">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-oliva">
            Explore por disciplina
          </h2>
          <p className="mt-2 text-cinza">
            Os materiais do Acervo são organizados pelas disciplinas do curso
            de Medicina Veterinária, para você encontrar rápido o que precisa.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {disciplinas.map((disciplina) => (
              <DisciplinaCard key={disciplina.id} disciplina={disciplina} />
            ))}
          </div>
        </Container>
      </section>

      {/* Biblioteca de Artigos */}
      <section className="border-t border-areia bg-terroso/50 py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lilas/25 px-3 py-1 text-xs font-medium text-oliva">
                <FlorLilas className="h-3.5 w-3.5 text-lilas" />
                Biblioteca de Artigos
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold text-oliva">
                Artigos científicos de acesso aberto, com um resumo para começar
              </h2>
              <p className="mt-3 max-w-2xl text-grafite">
                Reunimos artigos de acesso aberto (open access) sobre temas de
                Medicina Veterinária. Cada artigo vem acompanhado de um
                pré-resumo, feito para você entender rápido de que ele trata e
                decidir se vale a leitura completa antes da prova ou do
                plantão.
              </p>
            </div>
            <Link
              href="/artigos"
              className="shrink-0 rounded-md bg-oliva px-6 py-3 text-center font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
            >
              Explorar biblioteca de artigos
            </Link>
          </div>

          {ultimosArtigos.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {ultimosArtigos.map((artigo) => (
                <ArtigoCard key={artigo.id} artigo={artigo} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Chamada de cursos */}
      <section className="py-16">
        <Container className="flex flex-col items-start gap-6 rounded-2xl border border-areia bg-terroso p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-oliva">
              Quer ir além do Acervo?
            </h2>
            <p className="mt-2 max-w-xl text-grafite">
              Conheça os cursos do Instituto Lobeira de Ensino e aprofunde o
              que você estudou aqui, com aulas e acompanhamento.
            </p>
          </div>
          <a
            href={SITE.linkCursos}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md bg-ocre px-6 py-3 font-medium text-creme transition-colors duration-200 hover:bg-ocre/90"
          >
            Conheça nossos cursos
          </a>
        </Container>
      </section>
    </>
  );
}
