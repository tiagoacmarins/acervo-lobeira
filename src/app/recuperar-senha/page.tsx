import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import { requestPasswordResetAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function RecuperarSenhaPage() {
  return (
    <AuthCard
      titulo="Recuperar senha"
      subtitulo="Informe seu e-mail. Vamos enviar um link para você criar uma nova senha."
    >
      <form action={requestPasswordResetAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-grafite">
          E-mail
          <input
            type="email"
            name="email"
            required
            className="rounded-md border border-areia bg-white px-3 py-2 text-sm focus:border-oliva focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="rounded-md bg-oliva px-4 py-2.5 font-medium text-creme transition-colors duration-200 hover:bg-oliva/90"
        >
          Enviar link
        </button>
      </form>
    </AuthCard>
  );
}
