-- Acervo Lobeira — 0011: conteúdo de DEMONSTRAÇÃO (fictício)
--
-- Isto existe só para o site não ficar vazio enquanto vocês não
-- publicaram material de verdade. Todo item aqui tem is_demo = true,
-- e o site mostra um aviso visual "conteúdo de demonstração" nesses
-- casos. Quando houver material real, apague estas linhas pelo painel
-- admin (Fase 4) — elas foram feitas pra serem fáceis de identificar
-- e remover em massa (filtre por is_demo = true).

insert into autores (nome, bio)
select 'Equipe Acervo Lobeira', 'Conteúdo de demonstração produzido pela equipe do Acervo Lobeira.'
where not exists (select 1 from autores where nome = 'Equipe Acervo Lobeira');

-- MATERIAIS DEMO ---------------------------------------------------

insert into materiais (slug, titulo, subtitulo, resumo, tipo, disciplina_id, autor_id, regra_acesso, status, publicado_em, visualizacoes_count, is_demo)
select v.slug, v.titulo, v.subtitulo, v.resumo, v.tipo::tipo_material,
       (select id from disciplinas where slug = v.disciplina_slug),
       (select id from autores where nome = 'Equipe Acervo Lobeira'),
       v.regra_acesso::regra_acesso, 'publicado', v.publicado_em, v.visualizacoes, true
from (values
  ('demo-anatomia-cardiaca-resumo', 'Resumo de Anatomia Cardíaca em Pequenos Animais', 'Conteúdo de demonstração',
   'Estrutura do coração, grandes vasos e pontos de ausculta, direto ao ponto.', 'resumo',
   'anatomia-veterinaria', 'publico', now() - interval '2 days', 340),
  ('demo-farmacologia-antibioticos', 'Guia de Antibióticos em Clínica Veterinária', 'Conteúdo de demonstração',
   'Classes de antibióticos, espectro de ação e principais indicações clínicas.', 'apostila',
   'farmacologia-veterinaria', 'exclusivo_assinante', now() - interval '5 days', 210),
  ('demo-semiologia-exame-fisico', 'Roteiro de Exame Físico em Cães e Gatos', 'Conteúdo de demonstração',
   'Sequência prática de exame físico geral, da inspeção à ausculta.', 'mapa_mental',
   'semiologia-veterinaria', 'exclusivo_aluno', now() - interval '1 day', 180),
  ('demo-cirurgia-tecnicas-basicas', 'Técnicas Cirúrgicas Básicas: Passo a Passo', 'Conteúdo de demonstração',
   'Nós cirúrgicos, padrões de sutura e cuidados de assepsia.', 'slide',
   'cirurgia-veterinaria', 'visualizacao_download', now() - interval '9 days', 95),
  ('demo-patologia-clinica-hemograma', 'Interpretação de Hemograma em Patologia Clínica', 'Conteúdo de demonstração',
   'Como ler um hemograma e reconhecer os principais padrões de alteração.', 'resumo',
   'patologia-veterinaria', 'somente_visualizacao', now() - interval '12 days', 60),
  ('demo-nutricao-caes-idosos', 'Nutrição para Cães Idosos: Principais Cuidados', 'Conteúdo de demonstração',
   'Necessidades nutricionais e ajustes de dieta na terceira idade canina.', 'apostila',
   'nutricao-animal', 'todos_acesso_completo', now() - interval '3 days', 150),
  ('demo-diagnostico-imagem-radiografia', 'Fundamentos de Radiografia Veterinária', 'Conteúdo de demonstração',
   'Posicionamento, incidências mais usadas e leitura inicial de radiografias.', 'slide',
   'diagnostico-por-imagem', 'exclusivo_assinante', now() - interval '7 days', 130),
  ('demo-zootecnia-bovinos-corte', 'Manejo Nutricional de Bovinos de Corte', 'Conteúdo de demonstração',
   'Exercícios sobre exigências nutricionais em diferentes fases de recria e engorda.', 'exercicios',
   'zootecnia', 'publico', now() - interval '15 days', 40)
) as v(slug, titulo, subtitulo, resumo, tipo, disciplina_slug, regra_acesso, publicado_em, visualizacoes)
on conflict (slug) do nothing;

-- ARTIGOS DEMO -------------------------------------------------------

insert into artigos (slug, titulo, subtitulo, pre_resumo, resumo, fonte, url_original, disciplina_id, autor_id, status, publicado_em, visualizacoes_count, is_demo)
select v.slug, v.titulo, v.subtitulo, v.pre_resumo, v.resumo,
       'Conteúdo de demonstração — sem fonte real', null,
       (select id from disciplinas where slug = v.disciplina_slug),
       (select id from autores where nome = 'Equipe Acervo Lobeira'),
       'publicado', v.publicado_em, v.visualizacoes, true
from (values
  ('demo-obesidade-caes-manejo', 'Obesidade em Cães: Fatores de Risco e Manejo Clínico', 'Conteúdo de demonstração',
   'Panorama rápido sobre causas mais comuns de obesidade canina e como abordar o caso na consulta.',
   'A obesidade é uma das condições nutricionais mais prevalentes na clínica de pequenos animais. Este artigo de demonstração resume fatores de risco, comorbidades associadas e princípios gerais de manejo alimentar e comportamental.',
   'nutricao-animal', now() - interval '4 days', 85),
  ('demo-zoonoses-emergentes-panorama', 'Zoonoses Emergentes: Panorama Atual', 'Conteúdo de demonstração',
   'Visão geral de por que zoonoses emergentes importam para a saúde pública veterinária.',
   'Artigo de demonstração sobre o papel da vigilância veterinária na detecção precoce de zoonoses emergentes e na articulação com a saúde pública.',
   'saude-publica-veterinaria', now() - interval '10 days', 52),
  ('demo-anestesia-animais-silvestres', 'Anestesia em Animais Silvestres: Desafios Práticos', 'Conteúdo de demonstração',
   'Por que protocolos anestésicos de pequenos animais nem sempre se aplicam à fauna silvestre.',
   'Artigo de demonstração sobre as particularidades fisiológicas de espécies silvestres e os cuidados na escolha de protocolo anestésico.',
   'anestesiologia-veterinaria', now() - interval '6 days', 38),
  ('demo-bem-estar-sistemas-producao', 'Bem-estar Animal em Sistemas de Produção', 'Conteúdo de demonstração',
   'Como os "Cinco Domínios" de bem-estar animal se aplicam à pecuária moderna.',
   'Artigo de demonstração introduzindo indicadores de bem-estar animal usados na avaliação de sistemas de produção.',
   'bem-estar-animal', now() - interval '13 days', 27)
) as v(slug, titulo, subtitulo, pre_resumo, resumo, disciplina_slug, publicado_em, visualizacoes)
on conflict (slug) do nothing;
