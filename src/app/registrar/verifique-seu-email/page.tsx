import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Verifique seu e-mail" };

export default function VerifiqueSeuEmailPage() {
  return (
    <AuthCard titulo="Verifique seu e-mail">
      <p className="text-sm text-grafite">
        Enviamos um link de confirmação para o e-mail que você cadastrou.
        Abra sua caixa de entrada (e a pasta de spam, por garantia) e
        clique no link para ativar sua conta.
      </p>
    </AuthCard>
  );
}
