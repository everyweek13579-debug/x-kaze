-- ============================================================
-- Run this in the Supabase SQL Editor after creating a project.
-- ============================================================

-- profiles: mirrors auth.users so email is queryable without admin privileges
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: public read"
  on public.profiles for select using (true);

create policy "profiles: self update"
  on public.profiles for update using (auth.uid() = id);

-- Auto-insert profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- posts: つぶやき本体
create table public.posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  content    text not null check (char_length(content) <= 280),
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "posts: public read"
  on public.posts for select using (true);

create policy "posts: authenticated insert"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "posts: self delete"
  on public.posts for delete
  using (auth.uid() = user_id);

create index posts_created_at_idx on public.posts (created_at desc);
