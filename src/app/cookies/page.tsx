import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { obterConfigSite } from "@/lib/data/config";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Política de Cookies",
  alternates: { canonical: "/cookies" },
};

export default async function CookiesPage() {
  const config = await obterConfigSite();
  const hoje = new Date().toLocaleDateString("pt-BR");

  return (
    <LegalPageLayout titulo="Política de Cookies" atualizadoEm={hoje}>
      <p>
        Cookies são pequenos arquivos guardados no seu navegador. O {config.nomeAcervo} usa
        cookies de duas formas:
      </p>

      <h2>Cookies essenciais</h2>
      <p>
        Usados para manter você logado e lembrar suas preferências básicas (como já ter visto o
        aviso de cookies). Sem eles, partes do site não funcionam — por isso não pedimos
        permissão para esses, só avisamos que existem.
      </p>

      <h2>Cookies de anúncios (ainda não ativos)</h2>
      <p>
        O site está preparado para exibir anúncios (Google AdSense) no futuro, na Biblioteca de
        Artigos. Essa função está desligada por padrão. Quando for ativada, esta página será
        atualizada com os detalhes dos cookies de publicidade usados.
      </p>

      <h2>Como gerenciar cookies</h2>
      <p>
        Você pode apagar ou bloquear cookies nas configurações do seu navegador a qualquer
        momento — mas isso pode fazer você precisar entrar de novo na sua conta com mais
        frequência.
      </p>

      <h2>Contato</h2>
      <p>Dúvidas: {config.email}.</p>
    </LegalPageLayout>
  );
}
