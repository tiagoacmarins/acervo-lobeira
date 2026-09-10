import type { ConfigSite } from "@/lib/data/config";
import type { MaterialCompleto } from "@/lib/data/materiais";
import type { ArtigoCompleto } from "@/lib/data/artigos";

export function organizationSchema(config: ConfigSite, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.nome,
    url: config.siteInstitucional || baseUrl,
    logo: `${baseUrl}/logo-lobeira.png`,
    sameAs: [config.redesSociais.instagram, config.redesSociais.youtube, config.redesSociais.tiktok].filter(Boolean),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: config.telefone,
        email: config.email,
        contactType: "customer service",
      },
    ],
  };
}

export function websiteSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Acervo Lobeira",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/materiais?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(baseUrl: string, itens: { nome: string; caminho: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: `${baseUrl}${item.caminho}`,
    })),
  };
}

export function learningResourceSchema(material: MaterialCompleto, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: material.titulo,
    description: material.resumo ?? undefined,
    url: `${baseUrl}/materiais/${material.slug}`,
    image: material.capa_url ?? undefined,
    learningResourceType: material.tipo,
    about: material.disciplina?.nome,
    author: material.autor ? { "@type": "Organization", name: material.autor.nome } : undefined,
    isAccessibleForFree: material.regra_acesso === "publico" || material.regra_acesso === "todos_acesso_completo",
    inLanguage: "pt-BR",
  };
}

export function articleSchema(artigo: ArtigoCompleto, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.titulo,
    description: artigo.pre_resumo ?? undefined,
    url: `${baseUrl}/artigos/${artigo.slug}`,
    image: artigo.capa_url ?? undefined,
    datePublished: artigo.publicado_em ?? undefined,
    author: artigo.autor ? { "@type": "Organization", name: artigo.autor.nome } : undefined,
    about: artigo.disciplina?.nome,
    isAccessibleForFree: true,
    inLanguage: "pt-BR",
  };
}
