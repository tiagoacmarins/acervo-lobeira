import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const tipo = body?.tipo;
  const id = body?.id;

  if ((tipo !== "material" && tipo !== "artigo") || typeof id !== "string") {
    return NextResponse.json({ error: "requisição inválida" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "é preciso estar logado" }, { status: 401 });
  }

  const coluna = tipo === "material" ? "material_id" : "artigo_id";

  const { data: existente } = await supabase
    .from("favoritos")
    .select("id")
    .eq("user_id", auth.user.id)
    .eq(coluna, id)
    .maybeSingle();

  if (existente) {
    await supabase.from("favoritos").delete().eq("id", existente.id);
    return NextResponse.json({ favoritado: false });
  }

  await supabase.from("favoritos").insert({ user_id: auth.user.id, [coluna]: id });
  return NextResponse.json({ favoritado: true });
}
