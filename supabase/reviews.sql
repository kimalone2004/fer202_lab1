create table if not exists public.reviews (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  product_id integer     not null,
  author     text        not null default split_part(auth.jwt() ->> 'email', '@', 1),
  rating     integer     not null check (rating >= 1 and rating <= 5),
  comment    text        not null check (length(trim(comment)) >= 1 and length(comment) <= 500),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.reviews enable row level security;

-- Drop existing policies if they already exist to allow safe re-running
drop policy if exists "read all"   on public.reviews;
create policy "read all"   on public.reviews for select using (true);

drop policy if exists "insert own" on public.reviews;
create policy "insert own" on public.reviews for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "update own" on public.reviews;
create policy "update own" on public.reviews for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own" on public.reviews;
create policy "delete own" on public.reviews for delete to authenticated using (auth.uid() = user_id);
