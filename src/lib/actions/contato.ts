"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function enviarMensagemContatoAction(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const assunto = String(formData.get("assunto") ?? "").trim() || null;
  const mensagem = String(formData.get("mensagem") ?? "").trim();
  const voltarPara = String(formData.get("voltar_para") ?? "/contato");

  if (!nome || !email || !mensagem) {
    redirect(`${voltarPara}?erro=${encodeURIComponent("Preencha nome, e-mail e mensagem.")}`);
  }

  const supabase = await createClient();
  await supabase.from("mensagens_contato").insert({ nome, email, assunto, mensagem });

  redirect(`${voltarPara}?mensagem=${encodeURIComponent("Mensagem enviada! Vamos responder no seu e-mail.")}`);
}
