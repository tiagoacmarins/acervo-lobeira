-- Acervo Lobeira — 0009: contador automático de visualizações/downloads
-- e uma marcação para conteúdo de demonstração (fictício)

alter table materiais add column is_demo boolean not null default false;
alter table artigos add column is_demo boolean not null default false;
comment on column materiais.is_demo is 'true = conteúdo fictício, só para preencher o site enquanto não há materiais reais. O painel admin deve deixar isso visível e fácil de apagar em massa.';
comment on column artigos.is_demo is 'Mesma ideia de materiais.is_demo.';

-- Sempre que alguém "visualiza" um material/artigo (insere em
-- "visualizacoes"), o contador denormalizado sobe sozinho. É
-- security definer porque quem registra a visualização é o próprio
-- visitante (anon ou logado), que não tem permissão de UPDATE direto
-- em materiais/artigos.
create function bump_visualizacoes()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if new.material_id is not null then
    update materiais set visualizacoes_count = visualizacoes_count + 1 where id = new.material_id;
  elsif new.artigo_id is not null then
    update artigos set visualizacoes_count = visualizacoes_count + 1 where id = new.artigo_id;
  end if;
  return new;
end;
$$;
create trigger visualizacoes_bump after insert on visualizacoes
  for each row execute procedure bump_visualizacoes();

-- Mesma lógica para downloads (será usado a partir da Fase 3, quando
-- o download seguro existir — já deixamos o contador pronto).
create function bump_downloads()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  update materiais set downloads_count = downloads_count + 1 where id = new.material_id;
  return new;
end;
$$;
create trigger downloads_bump after insert on downloads
  for each row execute procedure bump_downloads();
