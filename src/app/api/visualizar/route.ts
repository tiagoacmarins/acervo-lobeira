import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Registra 1 visualização de um material ou artigo. Fica numa rota
 * separada (chamada pelo navegador depois que a página carrega) para
 * não estragar o cache (ISR) da página em si — a página continua
 * podendo ser servida rápido e igual para todo mundo, e o contador
 * sobe por fora.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const tipo = body?.tipo;
  const id = body?.id;

  if ((tipo !== "material" && tipo !== "artigo") || typeof id !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;
  const materialId = tipo === "material" ? id : null;
  const artigoId = tipo === "artigo" ? id : null;

  await supabase.from("visualizacoes").insert({ material_id: materialId, artigo_id: artigoId, user_id: userId });

  // Histórico só existe para quem está logado. Tira a entrada antiga
  // do mesmo item (se houver) e grava de novo, pra "Meu Acervo" mostrar
  // só a visita mais recente de cada material/artigo, não uma por vez
  // que a pessoa abriu a página.
  if (userId) {
    let del = supabase.from("historico").delete().eq("user_id", userId);
    del = materialId ? del.eq("material_id", materialId) : del.eq("artigo_id", artigoId!);
    await del;
    await supabase.from("historico").insert({ material_id: materialId, artigo_id: artigoId, user_id: userId });
  }

  return NextResponse.json({ ok: true });
}
