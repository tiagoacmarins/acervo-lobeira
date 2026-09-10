import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { obterConfigSite } from "@/lib/data/config";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Direitos Autorais",
  alternates: { canonical: "/direitos-autorais" },
};

export default async function DireitosAutoraisPage() {
  const config = await obterConfigSite();
  const hoje = new Date().toLocaleDateString("pt-BR");

  return (
    <LegalPageLayout titulo="Direitos Autorais" atualizadoEm={hoje}>
      <p>
        Os materiais e artigos publicados no {config.nomeAcervo} são de autoria do{" "}
        {config.nome} ou de terceiros com quem temos autorização, exceto os artigos da{" "}
        Biblioteca de Artigos, que são resumos e comentários próprios sobre trabalhos de{" "}
        acesso aberto já publicados em outro lugar, com link para a fonte original.
      </p>

      <h2>O que você pode fazer</h2>
      <p>
        Usar os materiais para seu estudo pessoal, dentro das regras de acesso de cada um
        (gratuito, exclusivo assinante, exclusivo aluno etc., indicadas na página do material).
      </p>

      <h2>O que não é permitido</h2>
      <ul>
        <li>Redistribuir ou revender os arquivos;</li>
        <li>Publicar os materiais exclusivos em outro site, grupo ou rede social;</li>
        <li>Remover marcas de autoria dos materiais.</li>
      </ul>

      <h2>Se você é autor de um material aqui</h2>
      <p>
        Se você identificar conteúdo seu publicado sem autorização, entre em contato pelo canal
        abaixo — veja também a página de{" "}
        <a href="/remocao" className="underline">
          Solicitar Remoção
        </a>
        .
      </p>

      <h2>Contato</h2>
      <p>{config.email}</p>
    </LegalPageLayout>
  );
}
