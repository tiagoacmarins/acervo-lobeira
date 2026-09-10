import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import { updatePasswordAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Criar nova senha" };

export default async function RedefinirSenhaPage(props: PageProps<"/redefinir-senha">) {
  const { erro } = await props.searchParams;

  return (
    <AuthCard
      titulo="Criar nova senha"
      subtitulo="Você chegou aqui pelo link enviado por e-mail."
      erro={typeof erro === "string" ? erro : undefined}
    >
      <form action={updatePasswordAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-grafite">
          Nova senha
          <input
            type="password"
            name="senha"
            required
            minLength={6}
            className="rounded-md border border-areia bg-white px-3 py-2 text-sm focus:border-oliva focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="rounded-md bg-oliva px-4 py-2.5 font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
        >
          Salvar nova senha
        </button>
      </form>
    </AuthCard>
  );
}
