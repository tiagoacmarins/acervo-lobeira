import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { podeAcessarArquivo, tipoArquivoPermitido, regraEfetiva, SEM_ENTITLEMENTS } from "@/lib/access";

/**
 * Download/visualização segura de um material.
 *
 * Ninguém baixa o arquivo "direto" — tudo passa por aqui:
 * 1. Confirma que o material existe e está publicado (via RLS normal).
 * 2. Decide se ESTE usuário (ou visitante) pode acessar o arquivo,
 *    (o Acervo é gratuito: só materiais "indisponível" são bloqueados).
 * 3. Só então usa a chave service_role (que ignora RLS) pra pegar o
 *    caminho do arquivo no Storage e gerar uma URL assinada, válida
 *    por 60 segundos.
 * 4. Registra o download (quando o usuário está logado).
 *
 * Se qualquer checagem falhar, redireciona de volta pra página do
 * material com uma explicação — nunca entrega o arquivo.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { origin } = new URL(request.url);
  const paginaMaterial = `${origin}/materiais/${slug}`;

  const supabase = await createClient();

  const { data: material } = await supabase
    .from("materiais")
    .select("id,regra_acesso,status")
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();

  if (!material) {
    return NextResponse.redirect(`${origin}/materiais`);
  }

  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;

  // O Acervo é gratuito, mas baixar exige conta (gratuita).
  if (!userId) {
    const entrar = new URL(`${origin}/entrar`);
    entrar.searchParams.set("next", `/materiais/${slug}`);
    entrar.searchParams.set("mensagem", "Entre ou crie sua conta grátis para baixar este material.");
    return NextResponse.redirect(entrar.toString());
  }

  const regra = regraEfetiva(material.regra_acesso);
  const permitido = podeAcessarArquivo(regra, SEM_ENTITLEMENTS);

  // Registro de auditoria da checagem (não decide nada, só documenta).
  await supabase.from("verificacoes_acesso").insert({
    user_id: userId,
    material_id: material.id,
    regra_avaliada: regra,
    permitido,
    motivo: permitido ? "acesso liberado" : "material indisponível",
  });

  if (!permitido) {
    return NextResponse.redirect(
      `${paginaMaterial}?erro=${encodeURIComponent("Este material está indisponível temporariamente.")}`,
    );
  }

  const admin = createAdminClient();
  const tipoDesejado = tipoArquivoPermitido(regra);

  const { data: arquivo } = await admin
    .from("arquivos")
    .select("bucket, storage_path")
    .eq("material_id", material.id)
    .eq("tipo", tipoDesejado)
    .maybeSingle();

  if (!arquivo) {
    return NextResponse.redirect(
      `${paginaMaterial}?erro=${encodeURIComponent("O arquivo deste material ainda não foi enviado pela equipe.")}`,
    );
  }

  const { data: signed, error: signError } = await admin.storage
    .from(arquivo.bucket)
    .createSignedUrl(arquivo.storage_path, 60);

  if (signError || !signed) {
    return NextResponse.redirect(
      `${paginaMaterial}?erro=${encodeURIComponent("Não foi possível gerar o link do arquivo. Tente de novo em instantes.")}`,
    );
  }

  if (userId && tipoDesejado === "pdf") {
    const { data: arquivoComId } = await admin
      .from("arquivos")
      .select("id")
      .eq("material_id", material.id)
      .eq("tipo", "pdf")
      .maybeSingle();
    if (arquivoComId) {
      await admin.from("downloads").insert({ user_id: userId, material_id: material.id, arquivo_id: arquivoComId.id });
    }
  }

  return NextResponse.redirect(signed.signedUrl);
}
