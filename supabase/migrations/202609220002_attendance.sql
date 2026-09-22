begin;

-- A ausência de registro significa "não registrado", nunca "ausente".
alter table public.portal_encounters add column attendance_version integer not null default 0;
create table public.portal_attendance (
  encounter_id uuid not null references public.portal_encounters(id),
  person_id uuid not null references public.portal_people(id),
  state text not null check (state in ('present','absent')),
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now(),
  primary key (encounter_id, person_id)
);
alter table public.portal_attendance enable row level security;
revoke all on public.portal_attendance from anon, authenticated;

-- O relatório guarda o resumo do momento do envio, sem expor a lista de pessoas ao Líder.
-- NULL identifica relatórios enviados antes desta migração.
alter table public.portal_reports add column present_count integer;
alter table public.portal_reports add column absent_count integer;
alter table public.portal_reports add column unregistered_count integer;

create function public.portal_attendance_roster(encounter uuid)
returns table(person_id uuid, person_name text, attendance_state text)
language plpgsql stable security definer set search_path = '' as $$
declare cell uuid;
begin
  select e.cell_id into cell from public.portal_encounters e where e.id = encounter;
  if cell is null or not public.portal_can(cell,array['secretary']) then
    raise exception 'Forbidden' using errcode='42501';
  end if;
  return query
    select p.id, p.name, a.state
    from public.portal_people p
    join (select distinct r.person_id from public.portal_assignments r where r.cell_id = cell) roster on roster.person_id = p.id
    left join public.portal_attendance a on a.encounter_id = encounter and a.person_id = p.id
    order by p.name, p.id;
end; $$;

create function public.portal_save_attendance(encounter uuid, person uuid, expected_version integer, new_state text)
returns void language plpgsql security definer set search_path = '' as $$
declare e public.portal_encounters; report_status text;
begin
  select * into e from public.portal_encounters where id = encounter for update;
  if e.id is null or not public.portal_can(e.cell_id,array['secretary']) then
    raise exception 'Forbidden' using errcode='42501';
  end if;
  if expected_version is null or e.attendance_version <> expected_version then
    raise exception 'Conflict' using errcode='40001';
  end if;
  if person is null or not exists (
    select 1 from public.portal_assignments r where r.cell_id = e.cell_id and r.person_id = person
  ) then raise exception 'Person is not assigned to this cell' using errcode='42501'; end if;
  select r.status into report_status from public.portal_reports r where r.encounter_id = encounter;
  if report_status is not null and report_status <> 'draft' then
    raise exception 'Report already sent' using errcode='42501';
  end if;
  if new_state is not null and new_state not in ('present','absent') then
    raise exception 'Invalid attendance' using errcode='22023';
  end if;
  if new_state is null then
    delete from public.portal_attendance where encounter_id = encounter and person_id = person;
  else
    insert into public.portal_attendance(encounter_id,person_id,state,updated_by)
      values(encounter,person,new_state,auth.uid())
      on conflict (encounter_id,person_id) do update
        set state=excluded.state,updated_by=excluded.updated_by,updated_at=now();
  end if;
  update public.portal_encounters set attendance_version=attendance_version+1 where id=encounter;
  insert into public.portal_audit(actor,encounter_id,action)
    values(auth.uid(),encounter,'attendance_updated');
end; $$;

create or replace function public.portal_save_report(encounter uuid, expected_version integer, content text, send boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare e public.portal_encounters; r public.portal_reports;
  present_total integer; absent_total integer; unregistered_total integer;
begin
  select * into e from public.portal_encounters where id=encounter for update;
  if e.id is null or not public.portal_can(e.cell_id,array['secretary']) then raise exception 'Forbidden' using errcode='42501'; end if;
  select * into r from public.portal_reports where encounter_id=encounter;
  if expected_version is null or coalesce(r.version,0) <> expected_version then raise exception 'Conflict' using errcode='40001'; end if;
  if r.status is not null and r.status <> 'draft' then raise exception 'Report already sent' using errcode='42501'; end if;
  if send is null or content is null or (send and length(trim(content)) = 0) then raise exception 'Invalid report' using errcode='22023'; end if;
  if send then
    select count(*) filter (where a.state = 'present'),
      count(*) filter (where a.state = 'absent'),
      count(*) filter (where a.state is null)
      into present_total,absent_total,unregistered_total
      from (select distinct person_id from public.portal_assignments where cell_id=e.cell_id) roster
      left join public.portal_attendance a on a.encounter_id=encounter and a.person_id=roster.person_id;
  end if;
  insert into public.portal_reports(encounter_id,narrative,status,version,updated_by,sent_by,sent_at,
    present_count,absent_count,unregistered_count)
    values(encounter,content,case when send then 'sentToLeader' else 'draft' end,1,auth.uid(),
      case when send then auth.uid() end,case when send then now() end,
      present_total,absent_total,unregistered_total)
    on conflict (encounter_id) do update set narrative=excluded.narrative,status=excluded.status,version=portal_reports.version+1,
      updated_by=excluded.updated_by,sent_by=excluded.sent_by,sent_at=excluded.sent_at,
      present_count=excluded.present_count,absent_count=excluded.absent_count,unregistered_count=excluded.unregistered_count;
  insert into public.portal_audit(actor,encounter_id,action) values(auth.uid(),encounter,case when send then 'report_sent' else 'report_saved' end);
end; $$;

revoke all on function public.portal_attendance_roster(uuid),
  public.portal_save_attendance(uuid,uuid,integer,text) from public, anon, authenticated;
grant execute on function public.portal_attendance_roster(uuid),
  public.portal_save_attendance(uuid,uuid,integer,text) to authenticated;
commit;
