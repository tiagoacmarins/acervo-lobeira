-- Acervo Lobeira — 0012: plano de assinatura do Acervo

insert into planos (nome, preco_centavos, periodicidade, ativo)
select 'Acervo Lobeira — Mensal', 1990, 'mensal', true
where not exists (select 1 from planos where nome = 'Acervo Lobeira — Mensal');
