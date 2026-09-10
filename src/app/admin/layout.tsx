import Link from "next/link";
import { exigirAdminOuEditor } from "@/lib/admin/guard";

const LINKS = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/materiais", label: "Materiais" },
  { href: "/admin/artigos", label: "Artigos" },
  { href: "/admin/disciplinas", label: "Disciplinas" },
  { href: "/admin/usuarios", label: "Usuários e assinaturas" },
  { href: "/admin/pagamentos", label: "Pagamentos" },
  { href: "/admin/mensagens", label: "Mensagens" },
  { href: "/admin/configuracoes", label: "Configurações" },
  { href: "/admin/auditoria", label: "Auditoria" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessao = await exigirAdminOuEditor();

  return (
    <div className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-[220px_1fr]">
      <aside className="border-b border-areia bg-terroso/40 px-4 py-6 lg:border-b-0 lg:border-r">
        <p className="font-display text-sm font-semibold text-oliva">Painel admin</p>
        <p className="mt-0.5 text-xs text-cinza">{sessao.email} · {sessao.role}</p>
        <nav className="mt-4 flex flex-row flex-wrap gap-1 lg:flex-col">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-grafite transition-colors duration-200 hover:bg-terroso hover:text-oliva"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
