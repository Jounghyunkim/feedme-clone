-- Profiles: one row per auth user, owner-only access.
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  display_name text check (char_length(display_name) <= 50),
  updated_at timestamptz not null default now(),

  primary key (id)
);

alter table public.profiles enable row level security;

-- Only signed-in users touch profiles; rows are created by the trigger below
-- and removed by the auth.users cascade, so no insert/delete for clients.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, updated_at) on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Create a profile whenever a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
