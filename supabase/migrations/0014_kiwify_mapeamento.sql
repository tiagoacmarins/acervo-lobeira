-- Acervo Lobeira — 0014: campos para ligar um plano/produto do nosso
-- banco a um produto real da Kiwify, editável pelo painel (sem precisar
-- mexer em código quando a conta da Kiwify estiver pronta).

alter table planos add column provider text not null default 'manual';
alter table planos add column provider_product_id text;
comment on column planos.provider_product_id is 'ID do produto na Kiwify que, quando comprado/renovado, libera este plano. Ainda PENDENTE até a conta da Kiwify existir.';
