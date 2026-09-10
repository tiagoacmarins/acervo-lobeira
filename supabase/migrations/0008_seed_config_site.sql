-- Acervo Lobeira — 0008: dados institucionais iniciais (config_site)
--
-- "on conflict do nothing" -> se você já editou algo pelo painel admin
-- e rodar este arquivo de novo por engano, ele não vai sobrescrever.

insert into config_site (chave, valor, descricao) values
  ('nome', '"Instituto Lobeira de Ensino"', 'Nome institucional completo'),
  ('nome_acervo', '"Acervo Lobeira"', 'Nome do produto/site'),
  ('cnpj', '"55.445.884/0001-80"',
    'PROVISÓRIO: é o CNPJ pessoal do responsável, até o CNPJ do Instituto ser emitido. Trocar quando tiver o definitivo.'),
  ('endereco', '{"logradouro":"Rua 200, Setor Leste Universitário","cidade":"Goiânia","estado":"GO","cep":null}',
    'CEP ainda está como null (PENDENTE) — editar quando confirmado.'),
  ('telefone', '"+55 62 99697-2841"', 'Telefone/WhatsApp'),
  ('whatsapp_link', '"https://wa.me/5562996972841"', null),
  ('email', '"contato@institutolobeira.com.br"', null),
  ('site_institucional', '"https://institutolobeira.com.br"', null),
  ('redes_sociais', '{"instagram":"https://www.instagram.com/institutolobeira","youtube":"https://youtube.com/@institutolobeira","tiktok":"https://www.tiktok.com/@instituto.lobeira"}', null),
  ('link_cursos', '"https://institutolobeira.com.br"',
    'Aponta para o site institucional por enquanto. Trocar pelo link real da Kiwify quando a página de vendas dos cursos estiver pronta.'),
  ('link_checkout_assinatura', 'null',
    'PENDENTE: link do checkout real da assinatura. Enquanto for null, os botões de assinar levam para a página /assinar do próprio site.'),
  ('preco_assinatura_mensal', '19.9', 'Em reais'),
  ('assinatura_editorial', '"Entender é o que te aprova. Decorar, não."', null)
on conflict (chave) do nothing;
