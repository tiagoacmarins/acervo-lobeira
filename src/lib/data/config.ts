import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site-config";

export interface ConfigSite {
  nome: string;
  nomeAcervo: string;
  cnpj: string;
  cnpjObs: string;
  endereco: { logradouro: string; cidade: string; estado: string; cep: string | null };
  telefone: string;
  whatsappLink: string;
  email: string;
  siteInstitucional: string;
  redesSociais: { instagram: string; youtube: string; tiktok: string };
  linkCursos: string;
  linkCheckoutAssinatura: string | null;
  precoAssinaturaMensal: number;
  assinaturaEditorial: string;
}

/**
 * Lê os dados institucionais do banco (tabela config_site, editável
 * pelo painel admin). Se uma chave não existir no banco por algum
 * motivo (projeto recém-criado, linha apagada por engano), usa o
 * valor do arquivo estático como reserva — o site nunca quebra por
 * causa disso.
 */
export async function obterConfigSite(): Promise<ConfigSite> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("config_site").select("chave, valor");

  if (error || !data || data.length === 0) {
    return SITE;
  }

  const mapa = Object.fromEntries(data.map((linha) => [linha.chave, linha.valor])) as Record<string, unknown>;

  return {
    nome: (mapa.nome as string) ?? SITE.nome,
    nomeAcervo: (mapa.nome_acervo as string) ?? SITE.nomeAcervo,
    cnpj: (mapa.cnpj as string) ?? SITE.cnpj,
    cnpjObs: SITE.cnpjObs,
    endereco: (mapa.endereco as ConfigSite["endereco"]) ?? SITE.endereco,
    telefone: (mapa.telefone as string) ?? SITE.telefone,
    whatsappLink: (mapa.whatsapp_link as string) ?? SITE.whatsappLink,
    email: (mapa.email as string) ?? SITE.email,
    siteInstitucional: (mapa.site_institucional as string) ?? SITE.siteInstitucional,
    redesSociais: (mapa.redes_sociais as ConfigSite["redesSociais"]) ?? SITE.redesSociais,
    linkCursos: (mapa.link_cursos as string) ?? SITE.linkCursos,
    linkCheckoutAssinatura: (mapa.link_checkout_assinatura as string | null) ?? SITE.linkCheckoutAssinatura,
    precoAssinaturaMensal: (mapa.preco_assinatura_mensal as number) ?? SITE.precoAssinaturaMensal,
    assinaturaEditorial: (mapa.assinatura_editorial as string) ?? SITE.assinaturaEditorial,
  };
}
