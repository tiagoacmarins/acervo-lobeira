import Link from "next/link";
import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import { signInAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage(props: PageProps<"/entrar">) {
  const { erro, mensagem, next } = await props.searchParams;
  const destino = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "";

  return (
    <AuthCard
      titulo="Entrar"
      subtitulo="Acesse sua conta do Acervo Lobeira"
      erro={typeof erro === "string" ? erro : undefined}
      mensagem={typeof mensagem === "string" ? mensagem : undefined}
    >
      <form action={signInAction} className="flex flex-col gap-4">
        {destino && <input type="hidden" name="next" value={destino} />}
        <label className="flex flex-col gap-1 text-sm text-grafite">
          E-mail
          <input
            type="email"
            name="email"
            required
            className="rounded-md border border-areia bg-white px-3 py-2 text-sm focus:border-oliva focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-grafite">
          Senha
          <input
            type="password"
            name="senha"
            required
            minLength={6}
            className="rounded-md border border-areia bg-white px-3 py-2 text-sm focus:border-oliva focus:outline-none"
          />
        </label>

        <div className="text-right text-sm">
          <Link href="/recuperar-senha" className="text-ocre transition-colors duration-200 hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        <button
          type="submit"
          className="rounded-md bg-oliva px-4 py-2.5 font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
        >
          Entrar
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-cinza">
        Ainda não tem conta?{" "}
        <Link href={destino ? `/registrar?next=${encodeURIComponent(destino)}` : "/registrar"} className="text-oliva underline">
          Cadastre-se
        </Link>
      </p>
    </AuthCard>
  );
}
