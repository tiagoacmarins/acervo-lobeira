import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { enviarMensagemContatoAction } from "@/lib/actions/contato";
import { campoLabel, campoInput, campoTextarea, botaoPrimario } from "@/lib/admin/ui";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Solicitar Remoção",
  alternates: { canonical: "/remocao" },
};

export default async function RemocaoPage(props: PageProps<"/remocao">) {
  const sp = await props.searchParams;
  const mensagem = typeof sp.mensagem === "string" ? sp.mensagem : undefined;
  const erro = typeof sp.erro === "string" ? sp.erro : undefined;

  return (
    <LegalPageLayout titulo="Solicitar Remoção de Conteúdo">
      <p>
        Se você é autor ou detentor dos direitos de um material publicado aqui sem autorização,
        ou de um artigo cujo resumo você considera indevido, preencha o formulário abaixo com o
        máximo de detalhes possível (link da página, motivo do pedido). Vamos analisar e responder
        pelo e-mail informado.
      </p>

      {mensagem && <p className="mt-4 rounded-md border border-oliva/30 bg-oliva/10 px-4 py-2 text-sm text-oliva">{mensagem}</p>}
      {erro && <p className="mt-4 rounded-md border border-ocre/30 bg-ocre/10 px-4 py-2 text-sm text-ocre">{erro}</p>}

      <form action={enviarMensagemContatoAction} className="mt-6 grid gap-4 not-prose">
        <input type="hidden" name="voltar_para" value="/remocao" />
        <input type="hidden" name="assunto" value="Solicitação de remoção" />

        <label className={campoLabel}>
          Seu nome
          <input name="nome" required className={campoInput} />
        </label>
        <label className={campoLabel}>
          Seu e-mail
          <input type="email" name="email" required className={campoInput} />
        </label>
        <label className={campoLabel}>
          Detalhes do pedido (link da página, motivo)
          <textarea name="mensagem" required className={campoTextarea} />
        </label>
        <button type="submit" className={botaoPrimario + " w-fit"}>
          Enviar solicitação
        </button>
      </form>
    </LegalPageLayout>
  );
}
