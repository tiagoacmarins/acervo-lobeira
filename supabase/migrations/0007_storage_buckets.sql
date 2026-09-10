-- Acervo Lobeira — 0007: buckets de Storage
--
-- "capas": público — imagens de capa de materiais/artigos e imagens de
-- Open Graph (para redes sociais). Não tem nada sigiloso.
--
-- "materiais-privados": privado — os PDFs de materiais exclusivos.
-- Ninguém lê esse bucket direto pelo navegador; o download passa por
-- uma rota do servidor (chave service_role) que confere a regra de
-- acesso do material e devolve uma URL assinada, temporária.

insert into storage.buckets (id, name, public)
values
  ('capas', 'capas', true),
  ('materiais-privados', 'materiais-privados', false)
on conflict (id) do nothing;

create policy capas_select on storage.objects for select
  using (bucket_id = 'capas');

create policy capas_insert on storage.objects for insert
  with check (bucket_id = 'capas' and public.is_admin_or_editor());

create policy capas_update on storage.objects for update
  using (bucket_id = 'capas' and public.is_admin_or_editor());

create policy capas_delete on storage.objects for delete
  using (bucket_id = 'capas' and public.is_admin_or_editor());

-- Só admin/editor gerenciam o bucket privado (upload pelo painel). Sem
-- política de SELECT para mais ninguém: nem usuário logado, nem
-- assinante, nem aluno leem este bucket diretamente.
create policy materiais_privados_admin on storage.objects for all
  using (bucket_id = 'materiais-privados' and public.is_admin_or_editor())
  with check (bucket_id = 'materiais-privados' and public.is_admin_or_editor());
