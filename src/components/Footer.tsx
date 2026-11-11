import Link from "next/link";
import Container from "@/components/Container";
import SocialIcons from "@/components/SocialIcons";
import { obterConfigSite } from "@/lib/data/config";

const legalLinks = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/cookies", label: "Cookies" },
  { href: "/termos", label: "Termos de Uso" },
  { href: "/direitos-autorais", label: "Direitos Autorais" },
  { href: "/remocao", label: "Solicitar Remoção" },
];

const exploreLinks = [
  { href: "/materiais", label: "Materiais" },
  { href: "/disciplinas", label: "Disciplinas" },
  { href: "/artigos", label: "Biblioteca de Artigos" },
];

export default async function Footer() {
  const config = await obterConfigSite();
  const ano = new Date().getFullYear();
  const enderecoCompleto = `${config.endereco.logradouro}, ${config.endereco.cidade}/${config.endereco.estado}${
    config.endereco.cep ? `, CEP ${config.endereco.cep}` : ""
  }`;

  return (
    <footer className="border-t border-areia bg-musgo text-creme">
      {/* Redes sociais em destaque, bem visíveis no topo do rodapé */}
      <div className="border-b border-creme/15">
        <Container className="flex flex-col items-center gap-3 py-5 sm:flex-row sm:justify-between">
          <p className="text-sm font-medium text-creme/90">
            Siga o Instituto Lobeira nas redes sociais
          </p>
          <SocialIcons redesSociais={config.redesSociais} />
        </Container>
      </div>

      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">{config.nomeAcervo}</p>
          <p className="mt-1 text-sm text-creme/80">{config.nome}</p>
          <p className="mt-4 text-sm italic text-creme/90">“{config.assinaturaEditorial}”</p>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-lavanda">
            Explorar
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors duration-200 hover:text-lavanda">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={config.linkCursos}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-lavanda"
              >
                Cursos do Instituto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-lavanda">
            Contato
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{enderecoCompleto}</li>
            <li>
              <a href={config.whatsappLink} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-lavanda">
                {config.telefone} (WhatsApp)
              </a>
            </li>
            <li>
              <a href={`mailto:${config.email}`} className="transition-colors duration-200 hover:text-lavanda">
                {config.email}
              </a>
            </li>
            <li>
              <a href={config.siteInstitucional} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-lavanda">
                institutolobeira.com.br
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-lavanda">
            Legal
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors duration-200 hover:text-lavanda">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-creme/15">
        <Container className="flex flex-col gap-1 py-4 text-xs text-creme/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ano} {config.nome}. Todos os direitos reservados.
          </p>
          <p>CNPJ {config.cnpj}</p>
        </Container>
      </div>
    </footer>
  );
}
