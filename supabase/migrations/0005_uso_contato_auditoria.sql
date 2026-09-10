-- Acervo Lobeira — 0005: visualizações, downloads, favoritos, histórico,
-- contato e auditoria

create table visualizacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  material_id uuid references materiais (id) on delete cascade,
  artigo_id uuid references artigos (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (material_id is not null and artigo_id is null) or
    (material_id is null and artigo_id is not null)
  )
);
create index visualizacoes_material_idx on visualizacoes (material_id);
create index visualizacoes_artigo_idx on visualizacoes (artigo_id);

create table downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  material_id uuid not null references materiais (id) on delete cascade,
  arquivo_id uuid not null references arquivos (id),
  created_at timestamptz not null default now()
);
create index downloads_user_idx on downloads (user_id);

create table favoritos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  material_id uuid references materiais (id) on delete cascade,
  artigo_id uuid references artigos (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (material_id is not null and artigo_id is null) or
    (material_id is null and artigo_id is not null)
  )
);
-- Um índice único "normal" não bastaria aqui: como material_id e
-- artigo_id nunca ficam preenchidos ao mesmo tempo, o Postgres trata
-- cada NULL como diferente de qualquer outro NULL e deixaria duplicar.
-- Os índices parciais abaixo fecham essa brecha.
create unique index favoritos_unico_material on favoritos (user_id, material_id) where material_id is not null;
create unique index favoritos_unico_artigo on favoritos (user_id, artigo_id) where artigo_id is not null;

create table historico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  material_id uuid references materiais (id) on delete cascade,
  artigo_id uuid references artigos (id) on delete cascade,
  visto_em timestamptz not null default now(),
  check (
    (material_id is not null and artigo_id is null) or
    (material_id is null and artigo_id is not null)
  )
);
create index historico_user_idx on historico (user_id, visto_em desc);

create table mensagens_contato (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  assunto text,
  mensagem text not null,
  respondido boolean not null default false,
  created_at timestamptz not null default now()
);

create table auditoria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  acao text not null,
  entidade text not null,
  entidade_id text,
  dados_antes jsonb,
  dados_depois jsonb,
  created_at timestamptz not null default now()
);
create index auditoria_entidade_idx on auditoria (entidade, entidade_id);
