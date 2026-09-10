import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { obterConfigSite } from "@/lib/data/config";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Política de Privacidade",
  alternates: { canonical: "/privacidade" },
};

export default async function PrivacidadePage() {
  const config = await obterConfigSite();
  const hoje = new Date().toLocaleDateString("pt-BR");

  return (
    <LegalPageLayout titulo="Política de Privacidade" atualizadoEm={hoje}>
      <p>
        Esta Política de Privacidade explica como o {config.nome} ({config.nomeAcervo}) coleta,
        usa e protege os dados pessoais de quem usa este site.
      </p>

      <h2>1. Quais dados coletamos</h2>
      <p>
        Quando você cria uma conta, coletamos nome e e-mail. Quando você assina o Acervo ou se
        matricula em um curso elegível, registramos essa relação para liberar o acesso correto.
        Também registramos, de forma agregada, quais materiais e artigos são mais acessados.
      </p>

      <h2>2. Como usamos seus dados</h2>
      <ul>
        <li>Para criar e manter sua conta;</li>
        <li>Para liberar o acesso a materiais exclusivos conforme sua assinatura ou matrícula;</li>
        <li>Para responder mensagens enviadas pelo formulário de contato;</li>
        <li>Para melhorar o site, com base no que é mais acessado.</li>
      </ul>

      <h2>3. Com quem compartilhamos</h2>
      <p>
        Usamos o Supabase (banco de dados e autenticação) e, para pagamentos, a Kiwify. Esses
        prestadores de serviço têm suas próprias políticas de privacidade. Não vendemos dados
        pessoais a terceiros.
      </p>

      <h2>4. Seus direitos</h2>
      <p>
        Você pode pedir a exclusão da sua conta e dos seus dados a qualquer momento, escrevendo
        para {config.email}.
      </p>

      <h2>5. Contato</h2>
      <p>
        Dúvidas sobre privacidade: {config.email} ou {config.telefone}.
      </p>
    </LegalPageLayout>
  );
}
