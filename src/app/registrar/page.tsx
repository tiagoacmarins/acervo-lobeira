import Link from "next/link";
import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import { signUpAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Criar conta" };

export default async function RegistrarPage(props: PageProps<"/registrar">) {
  const { erro, next } = await props.searchParams;
  const destino = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "";

  return (
    <AuthCard
      titulo="Criar conta"
      subtitulo="Grátis. Com a conta você baixa os materiais do Acervo, salva favoritos e acompanha seu histórico."
      erro={typeof erro === "string" ? erro : undefined}
    >
      <form action={signUpAction} className="flex flex-col gap-4">
        {destino && <input type="hidden" name="next" value={destino} />}
        <label className="flex flex-col gap-1 text-sm text-grafite">
          Nome completo
          <input
            type="text"
            name="nome"
            required
            className="rounded-md border border-areia bg-white px-3 py-2 text-sm focus:border-oliva focus:outline-none"
          />
        </label>
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
          <span className="text-xs text-cinza">Mínimo de 6 caracteres.</span>
        </label>

        <button
          type="submit"
          className="rounded-md bg-oliva px-4 py-2.5 font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
        >
          Criar conta
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-cinza">
        Já tem conta?{" "}
        <Link href={destino ? `/entrar?next=${encodeURIComponent(destino)}` : "/entrar"} className="text-oliva underline">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
