-- Acervo Lobeira — 0013: corrige a trava de "role" de profiles
--
-- A trava criada em 0006 (guard_profile_role) existe pra impedir que um
-- usuário comum, logado, vire admin editando o próprio perfil pelo
-- site — isso continua certo e continua valendo.
--
-- Mas ela também travava sem querer uma alteração feita diretamente no
-- banco (SQL Editor, ou um script com a chave service_role), porque
-- nesses casos não existe um "usuário logado" (auth.uid() vem vazio) e
-- a função interpretava isso como "ninguém admin fazendo a mudança".
-- A trava agora só entra em ação quando EXISTE um usuário logado
-- fazendo a alteração e esse usuário não é admin — exatamente o caso
-- que ela deveria impedir.

create or replace function guard_profile_role()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;
