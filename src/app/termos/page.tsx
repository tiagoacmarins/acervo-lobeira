import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { obterConfigSite } from "@/lib/data/config";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Termos de Uso",
  alternates: { canonical: "/termos" },
};

export default async function TermosPage() {
  const config = await obterConfigSite();
  const hoje = new Date().toLocaleDateString("pt-BR");

  return (
    <LegalPageLayout titulo="Termos de Uso" atualizadoEm={hoje}>
      <p>
        Ao usar o {config.nomeAcervo}, site do {config.nome}, você concorda com estes termos.
      </p>

      <h2>1. O que é o Acervo Lobeira</h2>
      <p>
        Uma plataforma de materiais de estudo de Medicina Veterinária. Parte do conteúdo é
        gratuito; parte é exclusiva para assinantes ou para alunos matriculados em cursos
        elegíveis do Instituto.
      </p>

      <h2>2. Sua conta</h2>
      <p>
        Você é responsável por manter sua senha em segurança e por tudo que acontecer usando sua
        conta. Avise-nos se suspeitar de uso indevido.
      </p>

      <h2>3. Uso permitido</h2>
      <ul>
        <li>Os materiais são para seu estudo pessoal;</li>
        <li>Não é permitido redistribuir, revender ou compartilhar arquivos exclusivos com quem não tem acesso;</li>
        <li>Não é permitido tentar burlar os controles de acesso do site.</li>
      </ul>

      <h2>4. Assinatura</h2>
      <p>
        A assinatura é cobrada de forma recorrente até ser cancelada. Você pode cancelar quando
        quiser; o acesso continua até o fim do período já pago.
      </p>

      <h2>5. Alterações</h2>
      <p>
        Podemos atualizar estes termos. Mudanças importantes serão avisadas no site.
      </p>

      <h2>6. Contato</h2>
      <p>{config.email}</p>
    </LegalPageLayout>
  );
}
