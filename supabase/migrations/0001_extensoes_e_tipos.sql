-- Acervo Lobeira — 0001: extensões e tipos (enums)
-- Extensões usadas pelo banco.
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";    -- busca por texto mais tolerante

-- Papel do usuário dentro do próprio site (admin/editor gerenciam o
-- conteúdo). "Assinante" e "Aluno" NÃO são papéis fixos aqui — são
-- calculados a partir das tabelas de assinaturas/matrículas, porque
-- podem vencer, ser renovados, cancelados etc.
create type user_role as enum ('usuario', 'editor', 'admin');

-- Regra de acesso de um material (Seção 4 do escopo do projeto).
create type regra_acesso as enum (
  'publico',                 -- gratuito, todo mundo vê e baixa
  'exclusivo_assinante',
  'exclusivo_aluno',
  'todos_acesso_completo',   -- visitante logado ou não, acesso completo
  'somente_visualizacao',
  'visualizacao_download',
  'indisponivel'
);

create type status_publicacao as enum ('rascunho', 'publicado', 'arquivado');

create type status_assinatura as enum ('ativa', 'cancelada', 'inadimplente', 'expirada');

create type status_matricula as enum ('ativa', 'concluida', 'cancelada', 'trancada');

create type tipo_material as enum (
  'apostila', 'resumo', 'slide', 'mapa_mental', 'exercicios', 'artigo_didatico', 'outro'
);
