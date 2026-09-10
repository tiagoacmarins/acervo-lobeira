-- Acervo Lobeira — 0006: RLS (Row Level Security)
--
-- Esta é a parte que garante que "material exclusivo" é exclusivo de
-- verdade, e não só um botão escondido no visual. Toda regra de acesso
-- é aplicada aqui, dentro do banco — o código do site nem precisa
-- lembrar de checar isso, o Postgres nunca devolve o que não deveria.

-- Funções auxiliares (security definer: fazem sua própria consulta a
-- "profiles" sem reativar essas mesmas regras de RLS, evitando loop).
create function is_admin_or_editor()
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create function is_admin()
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- Impede que um usuário comum promova a si mesmo a admin/editor
-- editando o próprio perfil.
create function guard_profile_role()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role and not is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;
create trigger guard_profile_role before update on profiles
  for each row execute procedure guard_profile_role();

-- ------------------------------------------------------------------
-- profiles
alter table profiles enable row level security;
create policy profiles_select on profiles for select
  using (id = auth.uid() or is_admin_or_editor());
create policy profiles_update on profiles for update
  using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());

-- config_site: dados institucionais, leitura pública, edição admin/editor
alter table config_site enable row level security;
create policy config_site_select on config_site for select using (true);
create policy config_site_write on config_site for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

-- Taxonomia: leitura pública, escrita só admin/editor
alter table disciplinas enable row level security;
create policy disciplinas_select on disciplinas for select using (true);
create policy disciplinas_write on disciplinas for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

alter table assuntos enable row level security;
create policy assuntos_select on assuntos for select using (true);
create policy assuntos_write on assuntos for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

alter table autores enable row level security;
create policy autores_select on autores for select using (true);
create policy autores_write on autores for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

alter table palavras_chave enable row level security;
create policy palavras_chave_select on palavras_chave for select using (true);
create policy palavras_chave_write on palavras_chave for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

-- materiais: a página pública só vê o que está publicado. Rascunho só
-- para quem criou ou para admin/editor. Isso vale mesmo para material
-- "exclusivo" — a linha aparece (capa, título, resumo...), o arquivo
-- é que fica protegido (ver "arquivos" abaixo).
alter table materiais enable row level security;
create policy materiais_select on materiais for select
  using (status = 'publicado' or is_admin_or_editor() or created_by = auth.uid());
create policy materiais_insert on materiais for insert
  with check (is_admin_or_editor());
create policy materiais_update on materiais for update
  using (is_admin_or_editor()) with check (is_admin_or_editor());
create policy materiais_delete on materiais for delete
  using (is_admin());

alter table materiais_palavras_chave enable row level security;
create policy materiais_palavras_chave_select on materiais_palavras_chave for select
  using (
    exists (
      select 1 from materiais m where m.id = material_id
      and (m.status = 'publicado' or is_admin_or_editor() or m.created_by = auth.uid())
    )
  );
create policy materiais_palavras_chave_write on materiais_palavras_chave for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

-- arquivos: NUNCA público. Nem o usuário logado lê esta tabela direto —
-- o download passa por uma rota do servidor que usa a chave
-- service_role e gera uma URL assinada temporária, depois de checar a
-- regra de acesso do material.
alter table arquivos enable row level security;
create policy arquivos_select on arquivos for select using (is_admin_or_editor());
create policy arquivos_write on arquivos for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

-- artigos: mesma lógica de materiais
alter table artigos enable row level security;
create policy artigos_select on artigos for select
  using (status = 'publicado' or is_admin_or_editor() or created_by = auth.uid());
create policy artigos_insert on artigos for insert
  with check (is_admin_or_editor());
create policy artigos_update on artigos for update
  using (is_admin_or_editor()) with check (is_admin_or_editor());
create policy artigos_delete on artigos for delete
  using (is_admin());

alter table artigos_palavras_chave enable row level security;
create policy artigos_palavras_chave_select on artigos_palavras_chave for select
  using (
    exists (
      select 1 from artigos a where a.id = artigo_id
      and (a.status = 'publicado' or is_admin_or_editor() or a.created_by = auth.uid())
    )
  );
create policy artigos_palavras_chave_write on artigos_palavras_chave for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

-- planos: público vê os planos ativos (para a página /assinar)
alter table planos enable row level security;
create policy planos_select on planos for select using (ativo or is_admin_or_editor());
create policy planos_write on planos for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

-- assinaturas: cada um vê a própria; admin/editor vê e gerencia todas
alter table assinaturas enable row level security;
create policy assinaturas_select on assinaturas for select
  using (user_id = auth.uid() or is_admin_or_editor());
create policy assinaturas_insert on assinaturas for insert
  with check (is_admin_or_editor());
create policy assinaturas_update on assinaturas for update
  using (is_admin_or_editor()) with check (is_admin_or_editor());
create policy assinaturas_delete on assinaturas for delete using (is_admin());

alter table produtos_elegiveis enable row level security;
create policy produtos_elegiveis_select on produtos_elegiveis for select using (is_admin_or_editor());
create policy produtos_elegiveis_write on produtos_elegiveis for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

alter table matriculas_cursos enable row level security;
create policy matriculas_select on matriculas_cursos for select
  using (user_id = auth.uid() or is_admin_or_editor());
create policy matriculas_insert on matriculas_cursos for insert
  with check (is_admin_or_editor());
create policy matriculas_update on matriculas_cursos for update
  using (is_admin_or_editor()) with check (is_admin_or_editor());
create policy matriculas_delete on matriculas_cursos for delete using (is_admin());

-- pagamentos: sem política de insert/update para usuário comum — só
-- o servidor (chave service_role, que ignora RLS) grava aqui.
alter table pagamentos enable row level security;
create policy pagamentos_select on pagamentos for select
  using (user_id = auth.uid() or is_admin_or_editor());

-- webhook_events: só admin/editor consulta; gravação é sempre via
-- service_role (webhook handler), nunca pelo navegador.
alter table webhook_events enable row level security;
create policy webhook_events_select on webhook_events for select using (is_admin_or_editor());

alter table concessoes_manuais enable row level security;
create policy concessoes_manuais_select on concessoes_manuais for select
  using (user_id = auth.uid() or is_admin_or_editor());
create policy concessoes_manuais_write on concessoes_manuais for all
  using (is_admin_or_editor()) with check (is_admin_or_editor());

alter table verificacoes_acesso enable row level security;
create policy verificacoes_acesso_insert on verificacoes_acesso for insert with check (true);
create policy verificacoes_acesso_select on verificacoes_acesso for select using (is_admin_or_editor());

-- Uso: cada usuário grava e lê o que é seu; admin/editor vê tudo
alter table visualizacoes enable row level security;
create policy visualizacoes_insert on visualizacoes for insert with check (true);
create policy visualizacoes_select on visualizacoes for select
  using (user_id = auth.uid() or is_admin_or_editor());

alter table downloads enable row level security;
create policy downloads_insert on downloads for insert with check (user_id = auth.uid());
create policy downloads_select on downloads for select
  using (user_id = auth.uid() or is_admin_or_editor());

alter table favoritos enable row level security;
create policy favoritos_insert on favoritos for insert with check (user_id = auth.uid());
create policy favoritos_select on favoritos for select
  using (user_id = auth.uid() or is_admin_or_editor());
create policy favoritos_delete on favoritos for delete using (user_id = auth.uid());

alter table historico enable row level security;
create policy historico_insert on historico for insert with check (user_id = auth.uid());
create policy historico_select on historico for select
  using (user_id = auth.uid() or is_admin_or_editor());
create policy historico_delete on historico for delete using (user_id = auth.uid());

-- Contato: formulário público pode inserir; só admin/editor lê/responde
alter table mensagens_contato enable row level security;
create policy mensagens_contato_insert on mensagens_contato for insert with check (true);
create policy mensagens_contato_select on mensagens_contato for select using (is_admin_or_editor());
create policy mensagens_contato_update on mensagens_contato for update
  using (is_admin_or_editor()) with check (is_admin_or_editor());

alter table auditoria enable row level security;
create policy auditoria_insert on auditoria for insert with check (is_admin_or_editor());
create policy auditoria_select on auditoria for select using (is_admin_or_editor());
