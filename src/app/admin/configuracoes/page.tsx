import type { Metadata } from "next";
import { obterConfigSite } from "@/lib/data/config";
import { salvarConfigAction } from "@/lib/actions/admin-config";
import { campoLabel, campoInput, botaoPrimario } from "@/lib/admin/ui";

export const metadata: Metadata = { title: "Configurações · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage(props: PageProps<"/admin/configuracoes">) {
  const sp = await props.searchParams;
  const mensagem = typeof sp.mensagem === "string" ? sp.mensagem : undefined;
  const config = await obterConfigSite();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">Configurações</h1>
      <p className="mt-1 text-sm text-cinza">
        Esses são os dados institucionais que aparecem no site (rodapé, contato, redes sociais...).
      </p>

      {mensagem && <p className="mt-3 rounded-md border border-oliva/30 bg-oliva/10 px-4 py-2 text-sm text-oliva">{mensagem}</p>}

      <form action={salvarConfigAction} className="mt-6 grid max-w-2xl gap-4">
        <label className={campoLabel}>
          Nome institucional
          <input name="nome" defaultValue={config.nome} className={campoInput} />
        </label>

        <label className={campoLabel}>
          CNPJ
          <input name="cnpj" defaultValue={config.cnpj} className={campoInput} />
        </label>

        <p className="mt-2 font-display text-sm font-semibold text-oliva">Endereço</p>
        <div className="grid grid-cols-2 gap-4">
          <label className={campoLabel}>
            Logradouro
            <input name="endereco_logradouro" defaultValue={config.endereco.logradouro} className={campoInput} />
          </label>
          <label className={campoLabel}>
            Cidade
            <input name="endereco_cidade" defaultValue={config.endereco.cidade} className={campoInput} />
          </label>
          <label className={campoLabel}>
            Estado (UF)
            <input name="endereco_estado" defaultValue={config.endereco.estado} maxLength={2} className={campoInput} />
          </label>
          <label className={campoLabel}>
            CEP
            <input name="endereco_cep" defaultValue={config.endereco.cep ?? ""} placeholder="00000-000" className={campoInput} />
          </label>
        </div>

        <p className="mt-2 font-display text-sm font-semibold text-oliva">Contato</p>
        <div className="grid grid-cols-2 gap-4">
          <label className={campoLabel}>
            Telefone (com DDI/DDD, ex: +55 62 99999-9999)
            <input name="telefone" defaultValue={config.telefone} className={campoInput} />
          </label>
          <label className={campoLabel}>
            Link do WhatsApp
            <input name="whatsapp_link" defaultValue={config.whatsappLink} className={campoInput} />
          </label>
          <label className={campoLabel}>
            E-mail
            <input type="email" name="email" defaultValue={config.email} className={campoInput} />
          </label>
          <label className={campoLabel}>
            Site institucional
            <input name="site_institucional" defaultValue={config.siteInstitucional} className={campoInput} />
          </label>
        </div>

        <p className="mt-2 font-display text-sm font-semibold text-oliva">Redes sociais</p>
        <div className="grid grid-cols-3 gap-4">
          <label className={campoLabel}>
            Instagram
            <input name="instagram" defaultValue={config.redesSociais.instagram} className={campoInput} />
          </label>
          <label className={campoLabel}>
            YouTube
            <input name="youtube" defaultValue={config.redesSociais.youtube} className={campoInput} />
          </label>
          <label className={campoLabel}>
            TikTok
            <input name="tiktok" defaultValue={config.redesSociais.tiktok} className={campoInput} />
          </label>
        </div>

        <p className="mt-2 font-display text-sm font-semibold text-oliva">Cursos e assinatura</p>
        <div className="grid grid-cols-2 gap-4">
          <label className={campoLabel}>
            Link &ldquo;Conheça nossos cursos&rdquo;
            <input name="link_cursos" defaultValue={config.linkCursos} className={campoInput} />
          </label>
          <label className={campoLabel}>
            Link do checkout de assinatura (deixe em branco se ainda não existir)
            <input name="link_checkout_assinatura" defaultValue={config.linkCheckoutAssinatura ?? ""} className={campoInput} />
          </label>
          <label className={campoLabel}>
            Preço da assinatura mensal (em reais, ex: 19.90)
            <input type="number" step="0.01" name="preco_assinatura_mensal" defaultValue={config.precoAssinaturaMensal} className={campoInput} />
          </label>
          <label className={campoLabel}>
            Frase de assinatura editorial
            <input name="assinatura_editorial" defaultValue={config.assinaturaEditorial} className={campoInput} />
          </label>
        </div>

        <button type="submit" className={botaoPrimario + " mt-2 w-fit"}>
          Salvar configurações
        </button>
      </form>
    </div>
  );
}
