# Acervo Lobeira

Plataforma de materiais de estudo de Medicina Veterinária do Instituto
Lobeira de Ensino. Next.js (App Router) + TypeScript + Tailwind CSS +
Supabase.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Configuração do Supabase (Fase 1)

O site precisa de um projeto no [Supabase](https://supabase.com) para
login, banco de dados e arquivos.

1. **Criar o projeto**: em supabase.com, crie uma conta e um novo
   projeto (escolha uma senha forte de banco de dados e guarde-a —
   raramente é usada, mas é bom ter).
2. **Copiar as chaves**: no painel do projeto, vá em
   *Settings → API*. Você vai precisar de três valores:
   - *Project URL*
   - *anon public* key
   - *service_role* key (⚠️ esta é secreta — nunca a compartilhe, nunca
     a coloque em código que vai para o GitHub)
3. **Preencher o `.env.local`**: copie o arquivo `.env.example` para um
   novo arquivo chamado `.env.local` (na raiz do projeto) e cole os
   três valores nos campos correspondentes.
4. **Rodar as migrações**: no painel do Supabase, abra o
   *SQL Editor* e execute, **um de cada vez, na ordem numérica**, o
   conteúdo dos arquivos em `supabase/migrations/`. Cada arquivo tem um
   número no nome (0001, 0002, ...) — é a ordem em que devem ser
   executados, porque um depende do anterior.
5. **Configurar o site URL do Auth**: em *Authentication → URL
   Configuration*, defina a *Site URL* como `http://localhost:3000`
   (em produção, será `https://acervolobeira.com.br`).

Depois disso, reinicie `npm run dev` e as páginas `/entrar` e
`/registrar` devem funcionar.

## Estrutura

- `src/app/` — páginas (Next.js App Router)
- `src/components/` — componentes de interface
- `src/lib/supabase/` — conexão com o Supabase (cliente do navegador,
  do servidor e de administração)
- `src/lib/actions/` — ações de servidor (login, cadastro, etc.)
- `src/lib/site-config.ts` — dados institucionais (nome, contato,
  redes sociais...). A partir da Fase 4, isso passa a vir do banco
  (tabela `config_site`), editável pelo painel.
- `supabase/migrations/` — histórico versionado de todas as mudanças
  no banco de dados.

## Documentação

- [.env.example](.env.example) — quais variáveis de ambiente existem e
  o que cada uma faz.
