-- Acervo Lobeira — 0010: disciplinas reais do curso de Medicina
-- Veterinária. Isto NÃO é dado fictício — são categorias de verdade
-- que o Acervo vai usar (diferente do conteúdo demo em 0011).

insert into disciplinas (slug, nome, ordem) values
  ('anatomia-veterinaria', 'Anatomia Veterinária', 1),
  ('fisiologia-animal', 'Fisiologia Animal', 2),
  ('bioquimica-veterinaria', 'Bioquímica Veterinária', 3),
  ('genetica-animal', 'Genética Animal', 4),
  ('histologia-e-embriologia', 'Histologia e Embriologia', 5),
  ('parasitologia-veterinaria', 'Parasitologia Veterinária', 6),
  ('microbiologia-e-imunologia', 'Microbiologia e Imunologia', 7),
  ('farmacologia-veterinaria', 'Farmacologia Veterinária', 8),
  ('patologia-veterinaria', 'Patologia Veterinária', 9),
  ('semiologia-veterinaria', 'Semiologia Veterinária', 10),
  ('clinica-medica-de-pequenos-animais', 'Clínica Médica de Pequenos Animais', 11),
  ('clinica-medica-de-grandes-animais', 'Clínica Médica de Grandes Animais', 12),
  ('cirurgia-veterinaria', 'Cirurgia Veterinária', 13),
  ('anestesiologia-veterinaria', 'Anestesiologia Veterinária', 14),
  ('diagnostico-por-imagem', 'Diagnóstico por Imagem', 15),
  ('reproducao-animal', 'Reprodução Animal', 16),
  ('nutricao-animal', 'Nutrição Animal', 17),
  ('zootecnia', 'Zootecnia', 18),
  ('saude-publica-veterinaria', 'Saúde Pública Veterinária', 19),
  ('bem-estar-animal', 'Bem-estar Animal', 20)
on conflict (slug) do nothing;
