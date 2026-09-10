import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

const PAGINAS_ESTATICAS: { caminho: string; prioridade: number; frequencia: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { caminho: "", prioridade: 1, frequencia: "daily" },
  { caminho: "/materiais", prioridade: 0.9, frequencia: "daily" },
  { caminho: "/disciplinas", prioridade: 0.8, frequencia: "weekly" },
  { caminho: "/artigos", prioridade: 0.8, frequencia: "daily" },
  { caminho: "/assinar", prioridade: 0.7, frequencia: "monthly" },
  { caminho: "/sobre", prioridade: 0.5, frequencia: "monthly" },
  { caminho: "/contato", prioridade: 0.5, frequencia: "monthly" },
  { caminho: "/privacidade", prioridade: 0.2, frequencia: "yearly" },
  { caminho: "/cookies", prioridade: 0.2, frequencia: "yearly" },
  { caminho: "/termos", prioridade: 0.2, frequencia: "yearly" },
  { caminho: "/direitos-autorais", prioridade: 0.2, frequencia: "yearly" },
  { caminho: "/remocao", prioridade: 0.2, frequencia: "yearly" },
];

/**
 * Gera o sitemap.xml automaticamente — toda vez que um material ou
 * artigo é publicado pelo painel, ele aparece aqui sozinho na próxima
 * vez que o Google (ou qualquer buscador) vier consultar.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const supabase = await createClient();

  const [{ data: materiais }, { data: artigos }, { data: disciplinas }] = await Promise.all([
    supabase.from("materiais").select("slug, updated_at").eq("status", "publicado"),
    supabase.from("artigos").select("slug, updated_at").eq("status", "publicado"),
    supabase.from("disciplinas").select("slug, updated_at"),
  ]);

  const estaticas: MetadataRoute.Sitemap = PAGINAS_ESTATICAS.map((p) => ({
    url: `${base}${p.caminho}`,
    changeFrequency: p.frequencia,
    priority: p.prioridade,
  }));

  const paginasMateriais: MetadataRoute.Sitemap = (materiais ?? []).map((m) => ({
    url: `${base}/materiais/${m.slug}`,
    lastModified: m.updated_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const paginasArtigos: MetadataRoute.Sitemap = (artigos ?? []).map((a) => ({
    url: `${base}/artigos/${a.slug}`,
    lastModified: a.updated_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const paginasDisciplinas: MetadataRoute.Sitemap = (disciplinas ?? []).map((d) => ({
    url: `${base}/disciplinas/${d.slug}`,
    lastModified: d.updated_at,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...estaticas, ...paginasMateriais, ...paginasArtigos, ...paginasDisciplinas];
}
