/**
 * Imprime um bloco de dados estruturados (JSON-LD) na página. Isso é
 * invisível pro visitante — é só pro Google (e outros buscadores)
 * entenderem melhor "isto aqui é uma Organização", "isto é um
 * material didático", etc. Ajuda a aparecer melhor na busca.
 */
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
