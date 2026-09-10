import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Painel administrativo" };
export const dynamic = "force-dynamic";

async function contar(query: PromiseLike<{ count: number | null }>) {
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [materiaisPublicados, materiaisRascunho, artigosPublicados, assinantesAtivos] = await Promise.all([
    contar(supabase.from("materiais").select("id", { count: "exact", head: true }).eq("status", "publicado")),
    contar(supabase.from("materiais").select("id", { count: "exact", head: true }).eq("status", "rascunho")),
    contar(supabase.from("artigos").select("id", { count: "exact", head: true }).eq("status", "publicado")),
    contar(supabase.from("assinaturas").select("id", { count: "exact", head: true }).eq("status", "ativa")),
  ]);

  const cards = [
    { label: "Materiais publicados", valor: materiaisPublicados, href: "/admin/materiais" },
    { label: "Materiais em rascunho", valor: materiaisRascunho, href: "/admin/materiais" },
    { label: "Artigos publicados", valor: artigosPublicados, href: "/admin/artigos" },
    { label: "Assinaturas ativas", valor: assinantesAtivos, href: "/admin/usuarios" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-oliva">Painel administrativo</h1>
      <p className="mt-1 text-cinza">Visão geral do Acervo Lobeira.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-areia bg-creme p-5 transition-colors duration-200 hover:border-lilas"
          >
            <p className="font-display text-3xl font-semibold text-oliva">{c.valor}</p>
            <p className="mt-1 text-sm text-cinza">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/admin/materiais/novo" className="rounded-md bg-oliva px-5 py-2.5 text-sm font-medium text-creme transition-colors duration-200 hover:bg-oliva/90">
          + Novo material
        </Link>
        <Link href="/admin/artigos/novo" className="rounded-md border border-oliva px-5 py-2.5 text-sm font-medium text-oliva transition-colors duration-200 hover:bg-terroso">
          + Novo artigo
        </Link>
      </div>
    </div>
  );
}
