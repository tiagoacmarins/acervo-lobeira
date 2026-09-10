import type { Metadata } from "next";
import { Fredoka, Raleway, Quicksand } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import { obterConfigSite } from "@/lib/data/config";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Acervo Lobeira: Materiais de Medicina Veterinária",
    template: "%s · Acervo Lobeira",
  },
  description:
    "Acervo Lobeira: materiais de estudo de Medicina Veterinária do Instituto Lobeira de Ensino. Entender é o que te aprova. Decorar, não.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Acervo Lobeira",
    title: "Acervo Lobeira: Materiais de Medicina Veterinária",
    description: "Materiais de estudo de Medicina Veterinária do Instituto Lobeira de Ensino.",
    images: ["/images/hero-cerrado.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acervo Lobeira",
    description: "Materiais de estudo de Medicina Veterinária do Instituto Lobeira de Ensino.",
    images: ["/images/hero-cerrado.png"],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const config = await obterConfigSite();

  return (
    <html
      lang="pt-BR"
      className={`${fredoka.variable} ${raleway.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-creme text-grafite">
        <JsonLd data={organizationSchema(config, siteUrl)} />
        <JsonLd data={websiteSchema(siteUrl)} />

        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-oliva focus:px-4 focus:py-2 focus:text-creme"
        >
          Pular para o conteúdo
        </a>

        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
