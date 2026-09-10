import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Verifique seu e-mail" };

export default function VerifiqueSeuEmailPage() {
  return (
    <AuthCard titulo="Verifique seu e-mail">
      <p className="text-sm text-grafite">
        Se houver uma conta com esse e-mail, enviamos um link para você
        criar uma nova senha. Abra sua caixa de entrada (e a pasta de
        spam, por garantia).
      </p>
    </AuthCard>
  );
}
