import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { createClient } from "@/lib/supabase/server";
import { buscarAssinaturaAtiva } from "@/lib/data/conta";
import { obterConfigSite } from "@/lib/data/config";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Assinar o Acervo",
  description: "Assine o Acervo Lobeira e tenha acesso completo aos materiais de Medicina Veterinária.",
  alternates: { canonical: "/assinar" },
};

const BENEFICIOS = [
  "Acesso a todos os materiais exclusivos do Acervo",
  "Conteúdo novo publicado direto na sua área",
  "Organizado por disciplina, fácil de encontrar",
  "Cancele quando quiser",
];

export default async function AssinarPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;

  const [{ data: plano }, assinatura, SITE] = await Promise.all([
    supabase.from("planos").select("nome, preco_centavos, periodicidade").eq("ativo", true).limit(1).maybeSingle(),
    userId ? buscarAssinaturaAtiva(userId) : Promise.resolve(null),
    obterConfigSite(),
  ]);

  const preco = plano ? (plano.preco_centavos / 100).toFixed(2).replace(".", ",") : SITE.precoAssinaturaMensal.toFixed(2).replace(".", ",");

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-3xl font-semibold text-oliva">Assine o Acervo Lobeira</h1>
        <p className="mt-3 text-cinza">
          Acesso completo a todos os materiais de estudo de Medicina Veterinária, por um preço
          de cafezinho.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-areia bg-terroso p-8 text-center">
        <p className="font-display text-4xl font-semibold text-oliva">
          R$ {preco}
          <span className="text-base font-normal text-cinza">/{plano?.periodicidade === "mensal" ? "mês" : "período"}</span>
        </p>

        <ul className="mt-6 space-y-2 text-left text-sm text-grafite">
          {BENEFICIOS.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="text-oliva">✓</span>
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          {assinatura ? (
            <>
              <p className="rounded-md bg-oliva/10 px-4 py-3 text-sm font-medium text-oliva">
                Você já é assinante! 🎉
              </p>
              <Link
                href="/minha-conta"
                className="mt-3 inline-block text-sm font-medium text-oliva underline"
              >
                Ver minha conta
              </Link>
            </>
          ) : !userId ? (
            <>
              <Link
                href="/registrar"
                className="block rounded-md bg-oliva px-6 py-3 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
              >
                Criar conta para assinar
              </Link>
              <p className="mt-3 text-xs text-cinza">Já tem conta? <Link href="/entrar" className="underline">Entre</Link> antes de assinar.</p>
            </>
          ) : (
            <>
              <p className="rounded-md border border-ocre/30 bg-ocre/10 px-4 py-3 text-sm text-ocre">
                O pagamento online ainda está sendo configurado. Fale com a gente pelo WhatsApp
                para liberar seu acesso.
              </p>
              <a
                href={SITE.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-md bg-oliva px-6 py-3 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
              >
                Falar no WhatsApp
              </a>
            </>
          )}
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-md text-center text-sm text-cinza">
        Já é aluno de um curso do Instituto Lobeira? Sua matrícula ativa já dá acesso completo ao
        Acervo, sem precisar assinar.
      </p>
    </Container>
  );
}
