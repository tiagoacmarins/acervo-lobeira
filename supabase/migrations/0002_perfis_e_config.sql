-- Acervo Lobeira — 0002: perfis de usuário + configurações do site

-- Um perfil por usuário do Supabase Auth. Criado automaticamente
-- (trigger abaixo) sempre que alguém se cadastra.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome_completo text,
  avatar_url text,
  role user_role not null default 'usuario',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'Um registro por usuário autenticado. "role" só distingue admin/editor — assinante e aluno vêm de outras tabelas.';

-- Cria o perfil automaticamente quando alguém se cadastra no Auth.
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome_completo)
  values (new.id, new.raw_user_meta_data ->> 'nome_completo');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Configurações institucionais editáveis pelo painel (Seção 5 do
-- escopo). Guardado como chave/valor para o admin poder editar sem
-- precisar de uma coluna nova por campo.
create table config_site (
  chave text primary key,
  valor jsonb not null,
  descricao text,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles (id)
);

comment on table config_site is 'Dados institucionais (nome, CNPJ, endereço, contatos, links) editáveis pelo painel admin. Ver seed em 0008.';
