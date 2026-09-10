/**
 * Dados institucionais do Instituto Lobeira / Acervo Lobeira.
 *
 * IMPORTANTE: esta é a única fonte de verdade para esses dados no código.
 * Nenhum componente deve escrever telefone, e-mail, endereço, CNPJ etc.
 * espalhado por aí — todos importam este arquivo.
 *
 * Na Fase 1 este arquivo passa a ser alimentado pela tabela `config_site`
 * do Supabase (editável pelo painel admin, Fase 4), mas a FORMA (o "shape")
 * do objeto abaixo é o contrato que o resto do site já usa — então quando
 * isso for trocado por uma consulta ao banco, os componentes não precisam
 * mudar.
 *
 * Campos marcados como PENDENTE ou PROVISÓRIO ainda não têm um valor
 * definitivo confirmado. Não foram inventados — foram deixados como estão
 * até você confirmar o dado certo.
 */

export const SITE = {
  nome: "Instituto Lobeira de Ensino",
  nomeAcervo: "Acervo Lobeira",

  // PROVISÓRIO: é o CNPJ pessoal do dono, usado até o CNPJ do Instituto
  // sair. Troque aqui (e, a partir da Fase 4, pelo painel admin) assim
  // que tiver o definitivo.
  cnpj: "55.445.884/0001-80",
  cnpjObs: "PROVISÓRIO — CNPJ pessoal do responsável, até o CNPJ do Instituto ser emitido.",

  endereco: {
    logradouro: "Rua 200, Setor Leste Universitário",
    cidade: "Goiânia",
    estado: "GO",
    // PENDENTE: preencher quando você confirmar o CEP.
    cep: null as string | null,
  },

  telefone: "+55 62 99697-2841",
  whatsappLink: "https://wa.me/5562996972841",
  email: "contato@institutolobeira.com.br",

  siteInstitucional: "https://institutolobeira.com.br",

  redesSociais: {
    instagram: "https://www.instagram.com/institutolobeira",
    youtube: "https://youtube.com/@institutolobeira",
    tiktok: "https://www.tiktok.com/@instituto.lobeira",
  },

  // Botões "Conheça nossos cursos" apontam para o site institucional
  // por enquanto (a pedido seu). Quando a página de vendas dos cursos
  // estiver pronta na Kiwify, é só trocar este valor pelo link real.
  linkCursos: "https://institutolobeira.com.br",

  // PENDENTE: link do checkout real da assinatura do Acervo (R$ 19,90/mês).
  // Enquanto for null, os botões de "Assinar" levam para a página /assinar
  // do próprio site (que explica o plano) em vez de um checkout externo.
  linkCheckoutAssinatura: null as string | null,

  precoAssinaturaMensal: 19.9,

  assinaturaEditorial: "Entender é o que te aprova. Decorar, não.",
} as const;
