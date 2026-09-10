import type { Metadata } from "next";
import Container from "@/components/Container";
import { obterConfigSite } from "@/lib/data/config";
import { enviarMensagemContatoAction } from "@/lib/actions/contato";
import { campoLabel, campoInput, campoTextarea, botaoPrimario } from "@/lib/admin/ui";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Contato",
  alternates: { canonical: "/contato" },
};

export default async function ContatoPage(props: PageProps<"/contato">) {
  const sp = await props.searchParams;
  const mensagem = typeof sp.mensagem === "string" ? sp.mensagem : undefined;
  const erro = typeof sp.erro === "string" ? sp.erro : undefined;

  const config = await obterConfigSite();
  const enderecoCompleto = `${config.endereco.logradouro}, ${config.endereco.cidade}/${config.endereco.estado}`;

  return (
    <Container className="max-w-4xl py-12">
      <h1 className="font-display text-3xl font-semibold text-oliva">Contato</h1>
      <p className="mt-2 text-cinza">Alguma dúvida, sugestão ou problema? Fale com a gente.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-cinza">E-mail</dt>
              <dd>
                <a href={`mailto:${config.email}`} className="font-medium text-oliva underline">
                  {config.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-cinza">WhatsApp</dt>
              <dd>
                <a href={config.whatsappLink} target="_blank" rel="noopener noreferrer" className="font-medium text-oliva underline">
                  {config.telefone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-cinza">Endereço</dt>
              <dd className="font-medium text-grafite">{enderecoCompleto}</dd>
            </div>
          </dl>
        </div>

        <div>
          {mensagem && <p className="mb-4 rounded-md border border-oliva/30 bg-oliva/10 px-4 py-2 text-sm text-oliva">{mensagem}</p>}
          {erro && <p className="mb-4 rounded-md border border-ocre/30 bg-ocre/10 px-4 py-2 text-sm text-ocre">{erro}</p>}

          <form action={enviarMensagemContatoAction} className="grid gap-4">
            <input type="hidden" name="voltar_para" value="/contato" />
            <label className={campoLabel}>
              Nome
              <input name="nome" required className={campoInput} />
            </label>
            <label className={campoLabel}>
              E-mail
              <input type="email" name="email" required className={campoInput} />
            </label>
            <label className={campoLabel}>
              Assunto (opcional)
              <input name="assunto" className={campoInput} />
            </label>
            <label className={campoLabel}>
              Mensagem
              <textarea name="mensagem" required className={campoTextarea} />
            </label>
            <button type="submit" className={botaoPrimario + " w-fit"}>
              Enviar mensagem
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
