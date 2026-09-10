import Link from "next/link";
import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import { signUpAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Criar conta" };

export default async function RegistrarPage(props: PageProps<"/registrar">) {
  const { erro } = await props.searchParams;

  return (
    <AuthCard
      titulo="Criar conta"
      subtitulo="Grátis. Dá acesso aos materiais públicos e é o primeiro passo para assinar o Acervo."
      erro={typeof erro === "string" ? erro : undefined}
    >
      <form action={signUpAction} className="flex flex-col gap-4">
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
        <Link href="/entrar" className="text-oliva underline">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
