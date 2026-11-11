import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import AccessBadge from "@/components/AccessBadge";
import DemoBadge from "@/components/DemoBadge";
import RegistrarVisualizacao from "@/components/RegistrarVisualizacao";
import FavoritoButton from "@/components/FavoritoButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { buscarMaterialPorSlug, materialTemArquivo } from "@/lib/data/materiais";
import { podeAcessarArquivo, tipoArquivoPermitido, regraEfetiva, SEM_ENTITLEMENTS } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";
import { TIPO_MATERIAL_LABELS } from "@/lib/labels";
import { learningResourceSchema } from "@/lib/seo/schemas";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(props: PageProps<"/materiais/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const material = await buscarMaterialPorSlug(slug);
  if (!material) return {};
  return {
    title: material.titulo,
    description: material.resumo ?? undefined,
    alternates: { canonical: `/materiais/${material.slug}` },
    openGraph: {
      title: material.titulo,
      description: material.resumo ?? undefined,
      images: material.capa_url ? [material.capa_url] : undefined,
      type: "article",
    },
  };
}

export default async function MaterialPage(props: PageProps<"/materiais/[slug]">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const erro = typeof sp.erro === "string" ? sp.erro : undefined;

  const material = await buscarMaterialPorSlug(slug);
  if (!material) notFound();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;

  const regra = regraEfetiva(material.regra_acesso);
  const permitido = podeAcessarArquivo(regra, SEM_ENTITLEMENTS);
  const tipoDesejado = tipoArquivoPermitido(regra);
  const arquivoDisponivel = permitido && (await materialTemArquivo(material.id, tipoDesejado));

  let favoritadoInicial = false;
  if (userId) {
    const { data: fav } = await supabase
      .from("favoritos")
      .select("id")
      .eq("user_id", userId)
      .eq("material_id", material.id)
      .maybeSingle();
    favoritadoInicial = !!fav;
  }

  return (
    <Container className="py-12">
      <RegistrarVisualizacao tipo="material" id={material.id} />
      <JsonLd data={learningResourceSchema(material, SITE_URL)} />

      <Breadcrumbs
        itens={[
          { nome: "Materiais", caminho: "/materiais" },
          ...(material.disciplina ? [{ nome: material.disciplina.nome, caminho: `/disciplinas/${material.disciplina.slug}` }] : []),
          { nome: material.titulo, caminho: `/materiais/${material.slug}` },
        ]}
      />

      {erro && (
        <p className="mt-4 rounded-md border border-ocre/30 bg-ocre/10 px-4 py-3 text-sm text-ocre">{erro}</p>
      )}

      <div className="mt-4 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <AccessBadge regraAcesso={regra} />
            <span className="text-xs font-medium uppercase tracking-wide text-cinza">
              {TIPO_MATERIAL_LABELS[material.tipo] ?? "Material"}
            </span>
            {material.is_demo && <DemoBadge />}
          </div>

          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-semibold text-oliva">{material.titulo}</h1>
            <FavoritoButton tipo="material" id={material.id} favoritadoInicial={favoritadoInicial} logado={!!userId} />
          </div>
          {material.subtitulo && <p className="mt-1 text-lg text-cinza">{material.subtitulo}</p>}

          {material.resumo && <p className="mt-6 text-grafite">{material.resumo}</p>}

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:max-w-sm">
            {material.autor && (
              <div>
                <dt className="text-cinza">Autoria</dt>
                <dd className="font-medium text-grafite">{material.autor.nome}</dd>
              </div>
            )}
            {material.especie && (
              <div>
                <dt className="text-cinza">Espécie</dt>
                <dd className="font-medium text-grafite">{material.especie}</dd>
              </div>
            )}
            <div>
              <dt className="text-cinza">Visualizações</dt>
              <dd className="font-medium text-grafite">{material.visualizacoes_count}</dd>
            </div>
          </dl>
        </div>

        <aside className="h-fit rounded-2xl border border-areia bg-terroso p-6">
          {arquivoDisponivel ? (
            <>
              <p className="font-display text-lg text-oliva">
                {tipoDesejado === "preview" ? "Prévia disponível" : "Arquivo disponível"}
              </p>
              <p className="mt-2 text-sm text-grafite">
                {tipoDesejado === "preview"
                  ? "Este material permite visualização, mas não download do arquivo completo."
                  : "Você tem acesso a este material. O link abre numa aba nova e expira em instantes, por segurança."}
              </p>
              <a
                href={`/materiais/${material.slug}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block w-full rounded-md bg-oliva px-4 py-2.5 text-center text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
              >
                {tipoDesejado === "preview" ? "Ver prévia" : "Baixar material"}
              </a>
            </>
          ) : permitido ? (
            <>
              <p className="font-display text-lg text-oliva">Ainda sem arquivo</p>
              <p className="mt-2 text-sm text-grafite">
                Você tem acesso a este material, mas a equipe ainda não enviou o arquivo pelo
                painel. Volte em breve.
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-lg text-oliva">Indisponível no momento</p>
              <p className="mt-2 text-sm text-grafite">
                Este material está indisponível temporariamente. Volte em breve.
              </p>
            </>
          )}
        </aside>
      </div>
    </Container>
  );
}
