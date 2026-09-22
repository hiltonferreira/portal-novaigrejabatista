-- Apenas banco de teste, após migration. Executar com psql como administrador.
-- Fornecer quatro UUIDs de contas Auth fictícias já criadas e confirmadas:
-- psql "$TEST_DATABASE_URL" -v secretary_user_id=UUID -v member_user_id=UUID 
--   -v leader_user_id=UUID -v other_leader_user_id=UUID -f supabase/seed-test.sql
-- O script é intencionalmente não idempotente: falha se o fixture já existir.
\set ON_ERROR_STOP on
begin;
insert into public.portal_people(id,name) values
 ('10000000-0000-0000-0000-000000000001','Secretaria teste'),
 ('10000000-0000-0000-0000-000000000002','Membro teste'),
 ('10000000-0000-0000-0000-000000000003','Líder teste'),
 ('10000000-0000-0000-0000-000000000004','Líder outra célula teste');
insert into public.portal_accounts(user_id,person_id) values
 (:'secretary_user_id','10000000-0000-0000-0000-000000000001'),
 (:'member_user_id','10000000-0000-0000-0000-000000000002'),
 (:'leader_user_id','10000000-0000-0000-0000-000000000003'),
 (:'other_leader_user_id','10000000-0000-0000-0000-000000000004');
insert into public.portal_cells(id,name) values
 ('20000000-0000-0000-0000-000000000001','Célula de teste A'),
 ('20000000-0000-0000-0000-000000000002','Célula de teste B');
insert into public.portal_assignments(person_id,cell_id,responsibility) values
 ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','secretary'),
 ('10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','member'),
 ('10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000001','leader'),
 ('10000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000002','leader');
insert into public.portal_encounters(cell_id,occurs_on,location) values
 ('20000000-0000-0000-0000-000000000001',current_date,'Local fictício A'),
 ('20000000-0000-0000-0000-000000000002',current_date,'Local fictício B');
commit;
