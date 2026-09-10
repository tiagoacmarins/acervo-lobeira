import type { Metadata } from "next";
import Container from "@/components/Container";
import { obterConfigSite } from "@/lib/data/config";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Sobre",
  alternates: { canonical: "/sobre" },
};

export default async function SobrePage() {
  const config = await obterConfigSite();

  return (
    <Container className="max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold text-oliva">Sobre o {config.nome}</h1>

      <p className="mt-6 font-display text-xl text-ocre">&ldquo;{config.assinaturaEditorial}&rdquo;</p>

      <div className="mt-6 space-y-4 text-grafite leading-relaxed">
        <p>
          O {config.nome} existe para ajudar quem estuda Medicina Veterinária a entender a
          matéria de verdade, não só decorar pra prova. O {config.nomeAcervo} reúne esse material
          de estudo num só lugar, organizado por disciplina.
        </p>
        <p>
          Nos materiais, o selo <strong>Antídoto</strong> marca os pontos que mais caem em prova e
          que mais se confundem na prática clínica — o que você não pode esquecer.
        </p>
        <p>
          Além do Acervo, o Instituto oferece cursos completos — quem está matriculado tem acesso
          automático a todo o conteúdo do Acervo, sem pagar de novo.
        </p>
      </div>

      <p className="mt-8 text-sm text-cinza">
        Esta página ainda vai ganhar mais detalhes sobre a história e a equipe do Instituto —
        por enquanto, esse é o resumo.
      </p>
    </Container>
  );
}
