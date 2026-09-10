-- Acervo Lobeira — 0004: planos, assinaturas, matrículas e pagamentos

create table planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  preco_centavos int not null,
  periodicidade text not null default 'mensal',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  plano_id uuid references planos (id),
  status status_assinatura not null default 'ativa',
  inicio timestamptz not null default now(),
  fim timestamptz,
  provider text not null default 'manual',
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on assinaturas
  for each row execute procedure set_updated_at();
create index assinaturas_user_idx on assinaturas (user_id);

-- Cursos/produtos do Instituto que dão direito a acesso completo ao
-- Acervo sem pagar de novo (matrícula ativa = "Aluno").
create table produtos_elegiveis (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'manual',
  provider_product_id text,
  nome text not null,
  descricao text,
  created_at timestamptz not null default now()
);

create table matriculas_cursos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  produto_elegivel_id uuid not null references produtos_elegiveis (id),
  status status_matricula not null default 'ativa',
  inicio timestamptz not null default now(),
  fim timestamptz,
  provider_enrollment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on matriculas_cursos
  for each row execute procedure set_updated_at();
create index matriculas_user_idx on matriculas_cursos (user_id);

create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  assinatura_id uuid references assinaturas (id) on delete set null,
  provider text not null,
  provider_payment_id text not null,
  valor_centavos int,
  status text not null,
  payload jsonb,
  created_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

-- Idempotência de webhooks (Guardrail #3): cada evento recebido de um
-- provedor de pagamento (ex.: Kiwify) é gravado com um id único do
-- próprio provedor. Reprocessar o mesmo evento nunca duplica acesso,
-- porque a chave (provider, provider_event_id) é única.
create table webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  tipo_evento text not null,
  payload jsonb not null,
  status text not null default 'recebido',
  processado_em timestamptz,
  erro text,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

-- Acesso liberado/revogado manualmente por um admin (ex.: enquanto a
-- integração de pagamento real não está pronta, ou para casos especiais).
create table concessoes_manuais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  tipo text not null check (tipo in ('assinatura', 'matricula')),
  motivo text,
  concedido_por uuid references profiles (id),
  inicio timestamptz not null default now(),
  fim timestamptz,
  created_at timestamptz not null default now()
);

-- Log de checagens de acesso a material exclusivo (útil para depurar o
-- paywall e para auditoria — não decide nada por si, é só registro).
create table verificacoes_acesso (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  material_id uuid references materiais (id) on delete set null,
  regra_avaliada regra_acesso,
  permitido boolean not null,
  motivo text,
  created_at timestamptz not null default now()
);
