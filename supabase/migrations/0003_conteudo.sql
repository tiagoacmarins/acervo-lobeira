-- Acervo Lobeira — 0003: disciplinas, assuntos, autores, materiais e artigos

-- Função genérica: mantém "updated_at" sempre atualizado.
create function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table disciplinas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  descricao text,
  ordem int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on disciplinas
  for each row execute procedure set_updated_at();

create table assuntos (
  id uuid primary key default gen_random_uuid(),
  disciplina_id uuid not null references disciplinas (id) on delete cascade,
  slug text not null,
  nome text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (disciplina_id, slug)
);
create trigger set_updated_at before update on assuntos
  for each row execute procedure set_updated_at();

create table autores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on autores
  for each row execute procedure set_updated_at();

create table palavras_chave (
  id uuid primary key default gen_random_uuid(),
  termo text not null unique,
  created_at timestamptz not null default now()
);

-- MATERIAIS -------------------------------------------------------------

create table materiais (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  subtitulo text,
  resumo text,
  tipo tipo_material not null default 'outro',
  especie text,
  disciplina_id uuid references disciplinas (id) on delete set null,
  assunto_id uuid references assuntos (id) on delete set null,
  autor_id uuid references autores (id) on delete set null,
  regra_acesso regra_acesso not null default 'exclusivo_assinante',
  capa_url text,
  status status_publicacao not null default 'rascunho',
  publicado_em timestamptz,
  visualizacoes_count bigint not null default 0,
  downloads_count bigint not null default 0,
  busca tsvector,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on materiais
  for each row execute procedure set_updated_at();
create index materiais_busca_idx on materiais using gin (busca);
create index materiais_disciplina_idx on materiais (disciplina_id);
create index materiais_status_idx on materiais (status);

create function materiais_busca_trigger() returns trigger language plpgsql as $$
begin
  new.busca :=
    setweight(to_tsvector('portuguese', coalesce(new.titulo, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(new.subtitulo, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(new.resumo, '')), 'C') ||
    setweight(to_tsvector('portuguese', coalesce(new.especie, '')), 'D');
  return new;
end;
$$;
create trigger materiais_busca_update
  before insert or update of titulo, subtitulo, resumo, especie on materiais
  for each row execute procedure materiais_busca_trigger();

create table materiais_palavras_chave (
  material_id uuid not null references materiais (id) on delete cascade,
  palavra_chave_id uuid not null references palavras_chave (id) on delete cascade,
  primary key (material_id, palavra_chave_id)
);

-- Arquivos de um material (capa pública, PDF/preview privados etc.).
-- Nunca é lido diretamente pelo navegador do visitante — veja RLS em
-- 0006 e as políticas de Storage em 0007.
create table arquivos (
  id uuid primary key default gen_random_uuid(),
  material_id uuid not null references materiais (id) on delete cascade,
  tipo text not null check (tipo in ('capa', 'pdf', 'preview')),
  bucket text not null,
  storage_path text not null,
  tamanho_bytes bigint,
  mime_type text,
  created_at timestamptz not null default now()
);

-- ARTIGOS -----------------------------------------------------------

create table artigos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  subtitulo text,
  pre_resumo text,
  resumo text,
  fonte text,
  url_original text,
  disciplina_id uuid references disciplinas (id) on delete set null,
  autor_id uuid references autores (id) on delete set null,
  capa_url text,
  status status_publicacao not null default 'rascunho',
  publicado_em timestamptz,
  visualizacoes_count bigint not null default 0,
  busca tsvector,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on artigos
  for each row execute procedure set_updated_at();
create index artigos_busca_idx on artigos using gin (busca);
create index artigos_status_idx on artigos (status);

create function artigos_busca_trigger() returns trigger language plpgsql as $$
begin
  new.busca :=
    setweight(to_tsvector('portuguese', coalesce(new.titulo, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(new.subtitulo, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(new.pre_resumo, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(new.resumo, '')), 'C');
  return new;
end;
$$;
create trigger artigos_busca_update
  before insert or update of titulo, subtitulo, pre_resumo, resumo on artigos
  for each row execute procedure artigos_busca_trigger();

create table artigos_palavras_chave (
  artigo_id uuid not null references artigos (id) on delete cascade,
  palavra_chave_id uuid not null references palavras_chave (id) on delete cascade,
  primary key (artigo_id, palavra_chave_id)
);
