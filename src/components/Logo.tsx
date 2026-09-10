import Link from "next/link";

/**
 * Wordmark do cabeçalho: "Instituto" em texto (ocre, fonte da marca) +
 * a arte oficial de "Lobeira" (com a flor lilás), em
 * `/public/logo-lobeira.png`.
 *
 * Se um dia vocês tiverem também a arte oficial da palavra "Instituto"
 * (ou o logotipo completo em uma única imagem), é só trocar o `<span>`
 * abaixo por outra tag `<img>` do mesmo jeito.
 */
export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 shrink-0" aria-label="Instituto Lobeira">
      <span className="font-display font-semibold text-lg text-ocre">
        Instituto
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-lobeira.png" alt="Lobeira" className="h-7 w-auto" />
    </Link>
  );
}
