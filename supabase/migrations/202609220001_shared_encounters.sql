begin;
create table public.portal_people (
  id uuid primary key default gen_random_uuid(), name text not null check (length(name) between 1 and 160)
);
create table public.portal_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  person_id uuid not null unique references public.portal_people(id)
);
create table public.portal_cells (id uuid primary key default gen_random_uuid(), name text not null);
create table public.portal_assignments (
  person_id uuid not null references public.portal_people(id),
  cell_id uuid not null references public.portal_cells(id),
  responsibility text not null check (responsibility in ('member','secretary','leader')),
  primary key (person_id, cell_id, responsibility)
);
create table public.portal_encounters (
  id uuid primary key default gen_random_uuid(), cell_id uuid not null references public.portal_cells(id),
  occurs_on date not null, location text not null default '' check (length(location) <= 300),
  announcement text not null default '' check (length(announcement) <= 2000),
  version integer not null default 0,
  updated_by uuid references auth.users(id), updated_at timestamptz not null default now()
);
create table public.portal_reports (
  encounter_id uuid primary key references public.portal_encounters(id),
  narrative text not null default '' check (length(narrative) <= 10000),
  status text not null default 'draft' check (status in ('draft','sentToLeader','viewedByLeader')),
  version integer not null default 0,
  updated_by uuid references auth.users(id), sent_by uuid references auth.users(id),
  viewed_by uuid references auth.users(id), sent_at timestamptz, viewed_at timestamptz
);
create table public.portal_audit (
  id bigint generated always as identity primary key,
  actor uuid not null references auth.users(id), encounter_id uuid not null references public.portal_encounters(id),
  action text not null, occurred_at timestamptz not null default now()
);

-- Funções auxiliares não confiam em papéis enviados pelo navegador nem em user_metadata.
create function public.portal_can(cell uuid, roles text[]) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.portal_accounts a join public.portal_assignments r on r.person_id = a.person_id
    where a.user_id = (select auth.uid()) and r.cell_id = cell and r.responsibility = any(roles));
$$;
revoke all on function public.portal_can(uuid,text[]) from public, anon, authenticated;
grant execute on function public.portal_can(uuid,text[]) to authenticated;

alter table public.portal_people enable row level security;
alter table public.portal_accounts enable row level security;
alter table public.portal_cells enable row level security;
alter table public.portal_assignments enable row level security;
alter table public.portal_encounters enable row level security;
alter table public.portal_reports enable row level security;
alter table public.portal_audit enable row level security;
create policy own_account on public.portal_accounts for select to authenticated using (user_id = (select auth.uid()));
create policy own_person on public.portal_people for select to authenticated using (
  id in (select person_id from public.portal_accounts where user_id = (select auth.uid())));
create policy own_assignments on public.portal_assignments for select to authenticated using (
  person_id in (select person_id from public.portal_accounts where user_id = (select auth.uid())));
create policy cell_read on public.portal_cells for select to authenticated using (public.portal_can(id,array['member','secretary','leader']));
create policy encounter_read on public.portal_encounters for select to authenticated using (public.portal_can(cell_id,array['member','secretary','leader']));
create policy report_read on public.portal_reports for select to authenticated using (exists (
  select 1 from public.portal_encounters e where e.id = encounter_id and
    (public.portal_can(e.cell_id,array['secretary']) or (status <> 'draft' and public.portal_can(e.cell_id,array['leader'])))));
-- Auditoria reservada à administração técnica do banco; não expor narrativas.
revoke all on public.portal_people, public.portal_accounts, public.portal_cells, public.portal_assignments,
  public.portal_encounters, public.portal_reports, public.portal_audit from anon, authenticated;
grant select on public.portal_people, public.portal_accounts, public.portal_cells, public.portal_assignments,
  public.portal_encounters, public.portal_reports to authenticated;

-- Escritas atômicas e controle de concorrência. Nenhuma escrita direta é concedida.
create function public.portal_update_encounter(encounter uuid, expected_version integer, new_location text, new_announcement text)
returns void language plpgsql security definer set search_path = '' as $$
declare e public.portal_encounters;
begin
  select * into e from public.portal_encounters where id = encounter for update;
  if e.id is null or not public.portal_can(e.cell_id,array['secretary']) then raise exception 'Forbidden' using errcode='42501'; end if;
  if expected_version is null or e.version <> expected_version then raise exception 'Conflict' using errcode='40001'; end if;
  update public.portal_encounters set location=new_location, announcement=new_announcement, version=version+1,
    updated_by=auth.uid(), updated_at=now() where id=encounter;
  insert into public.portal_audit(actor,encounter_id,action) values(auth.uid(),encounter,'encounter_updated');
end; $$;
create function public.portal_save_report(encounter uuid, expected_version integer, content text, send boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare e public.portal_encounters; r public.portal_reports;
begin
  select * into e from public.portal_encounters where id=encounter for update;
  if e.id is null or not public.portal_can(e.cell_id,array['secretary']) then raise exception 'Forbidden' using errcode='42501'; end if;
  select * into r from public.portal_reports where encounter_id=encounter;
  if expected_version is null or coalesce(r.version,0) <> expected_version then raise exception 'Conflict' using errcode='40001'; end if;
  if r.status is not null and r.status <> 'draft' then raise exception 'Report already sent' using errcode='42501'; end if;
  if send is null or (send and length(trim(content)) = 0) then raise exception 'Invalid report' using errcode='22023'; end if;
  insert into public.portal_reports(encounter_id,narrative,status,version,updated_by,sent_by,sent_at)
    values(encounter,content,case when send then 'sentToLeader' else 'draft' end,1,auth.uid(),
      case when send then auth.uid() end,case when send then now() end)
    on conflict (encounter_id) do update set narrative=excluded.narrative,status=excluded.status,version=portal_reports.version+1,
      updated_by=excluded.updated_by,sent_by=excluded.sent_by,sent_at=excluded.sent_at;
  insert into public.portal_audit(actor,encounter_id,action) values(auth.uid(),encounter,case when send then 'report_sent' else 'report_saved' end);
end; $$;
create function public.portal_view_report(encounter uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare e public.portal_encounters;
begin
  select * into e from public.portal_encounters where id=encounter for update;
  if e.id is null or not public.portal_can(e.cell_id,array['leader']) then raise exception 'Forbidden' using errcode='42501'; end if;
  update public.portal_reports set status='viewedByLeader', viewed_by=auth.uid(), viewed_at=now(), version=version+1
    where encounter_id=encounter and status='sentToLeader';
  if found then insert into public.portal_audit(actor,encounter_id,action) values(auth.uid(),encounter,'report_viewed'); end if;
end; $$;
revoke all on function public.portal_update_encounter(uuid,integer,text,text),
  public.portal_save_report(uuid,integer,text,boolean),public.portal_view_report(uuid) from public, anon, authenticated;
grant execute on function public.portal_update_encounter(uuid,integer,text,text),
  public.portal_save_report(uuid,integer,text,boolean),public.portal_view_report(uuid) to authenticated;
commit;
