-- TIVA automatic profile and wallet creation.
--
-- IMPORTANT:
-- Review the existing Supabase schema before running this SQL.
--
-- Expected columns:
-- profiles:
--   id, username, display_name, level,
--   total_gift_spent, created_at
--
-- wallets:
--   user_id, coin_balance,
--   creator_earnings, updated_at
--
-- This migration does not grant starter coins or money.

create or replace function public.tiva_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  generated_username text;
begin
  generated_username :=
    'user_' ||
    substr(
      replace(new.id::text, '-', ''),
      1,
      12
    );

  insert into public.profiles (
    id,
    username,
    display_name,
    level,
    total_gift_spent,
    created_at
  )
  values (
    new.id,
    generated_username,
    coalesce(
      nullif(
        new.raw_user_meta_data ->> 'display_name',
        ''
      ),
      'New TIVA User'
    ),
    1,
    0,
    now()
  )
  on conflict (id) do nothing;

  insert into public.wallets (
    user_id,
    coin_balance,
    creator_earnings,
    updated_at
  )
  values (
    new.id,
    0,
    0,
    now()
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Replace this trigger if it already exists.

drop trigger if exists tiva_on_auth_user_created
on auth.users;

create trigger tiva_on_auth_user_created
after insert on auth.users
for each row
execute procedure public.tiva_handle_new_user();

-- Ensure each user has no more than one wallet.
-- This will fail if duplicate user wallets already exist.

create unique index if not exists
wallets_user_id_unique
on public.wallets(user_id);

-- Enable Row Level Security.

alter table public.profiles
enable row level security;

alter table public.wallets
enable row level security;

-- Users may read their own wallet.

drop policy if exists
"Users can read own wallet"
on public.wallets;

create policy
"Users can read own wallet"
on public.wallets
for select
to authenticated
using (
  auth.uid() = user_id
);

-- Users may read their own profile.

drop policy if exists
"Users can read own profile"
on public.profiles;

create policy
"Users can read own profile"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
);

-- No client policy is added for changing wallet balances.
-- Financial mutations must be server-controlled.