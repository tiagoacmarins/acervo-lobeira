import { redirect } from "next/navigation";

// O Acervo Lobeira é gratuito: não existe mais assinatura.
export default function AssinarPage() {
  redirect("/");
}
