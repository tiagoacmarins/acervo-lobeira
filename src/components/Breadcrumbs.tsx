import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";

export interface ItemBreadcrumb {
  nome: string;
  caminho: string;
}

export default function Breadcrumbs({ itens }: { itens: ItemBreadcrumb[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <>
      <JsonLd data={breadcrumbSchema(baseUrl, itens)} />
      <nav aria-label="Trilha de navegação" className="text-sm text-cinza">
        <ol className="flex flex-wrap items-center gap-1.5">
          {itens.map((item, i) => {
            const ultimo = i === itens.length - 1;
            return (
              <li key={item.caminho} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {ultimo ? (
                  <span aria-current="page" className="text-grafite">
                    {item.nome}
                  </span>
                ) : (
                  <Link href={item.caminho} className="transition-colors duration-200 hover:text-oliva">
                    {item.nome}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
