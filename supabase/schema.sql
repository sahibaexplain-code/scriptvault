-- ═══════════════════════════════════════════════════════════════════════
-- ScriptVault database schema
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- Then run seed.sql for the sample catalogue.
--
-- Security model
--   • Catalogue tables are readable by everyone, but only published rows.
--   • script_contents (the paid text) has RLS ON and NO policies, so
--     only the server (service-role key) can read it, after checking a purchase.
--   • orders / purchases are written only by the server after Razorpay
--     verification. Customers can read their own rows, never write them.
--   • Storage bucket "script-files" is private (no policies).
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────── Profiles ─────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now()
);

-- Create a profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Helper used by policies. SECURITY DEFINER avoids recursive RLS on profiles.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ───────────── Catalogue ─────────────
create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  sort_order  int not null default 0
);

create table if not exists public.scripts (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  title                text not null,
  subtitle             text not null default '',
  category_slug        text not null references public.categories(slug),
  language             text not null check (language in ('Hindi', 'Hinglish', 'English')),
  format               text not null check (format in ('YouTube Long-form', 'Reels / Shorts', 'Documentary')),
  duration_minutes     numeric(6,2) not null check (duration_minutes > 0),
  word_count           int not null check (word_count > 0),
  price_inr            int not null check (price_inr >= 1),
  exclusive_price_inr  int check (exclusive_price_inr is null or exclusive_price_inr >= 1),
  exclusive_available  boolean not null default false,
  description          text not null default '',
  preview              text not null default '',
  tags                 text[] not null default '{}',
  thumbnail_url        text,
  is_featured          boolean not null default false,
  is_published         boolean not null default false,
  sales_count          int not null default 0,
  rating               numeric(2,1) not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists scripts_category_idx on public.scripts (category_slug) where is_published;

-- The PAID content. Never exposed through the public API.
create table if not exists public.script_contents (
  script_id   uuid primary key references public.scripts(id) on delete cascade,
  body        text not null default '',
  pdf_path    text,   -- optional uploaded file in storage bucket "script-files"
  docx_path   text,
  updated_at  timestamptz not null default now()
);

create table if not exists public.bundles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text not null default '',
  price_inr     int not null check (price_inr >= 1),
  badge         text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.bundle_items (
  bundle_id  uuid not null references public.bundles(id) on delete cascade,
  script_id  uuid not null references public.scripts(id) on delete cascade,
  primary key (bundle_id, script_id)
);

-- ───────────── Commerce ─────────────
create table if not exists public.orders (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete restrict,
  status               text not null default 'created' check (status in ('created', 'paid', 'failed', 'review')),
  amount_inr           int not null check (amount_inr >= 1),
  currency             text not null default 'INR',
  razorpay_order_id    text unique,
  razorpay_payment_id  text unique,
  notes                text,
  created_at           timestamptz not null default now(),
  paid_at              timestamptz
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  script_id   uuid references public.scripts(id) on delete set null,
  bundle_id   uuid references public.bundles(id) on delete set null,
  title       text not null,
  license     text not null default 'standard' check (license in ('standard', 'exclusive')),
  price_inr   int not null,
  check (script_id is not null or bundle_id is not null)
);

-- What a customer is entitled to download.
create table if not exists public.purchases (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  script_id   uuid not null references public.scripts(id) on delete cascade,
  order_id    uuid not null references public.orders(id) on delete cascade,
  license     text not null default 'standard' check (license in ('standard', 'exclusive')),
  created_at  timestamptz not null default now(),
  unique (user_id, script_id)
);

create table if not exists public.download_events (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  script_id   uuid not null references public.scripts(id) on delete cascade,
  format      text not null,
  created_at  timestamptz not null default now()
);

-- ───────────── Leads ─────────────
create table if not exists public.custom_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  name          text not null,
  email         text not null,
  content_type  text not null,
  language      text not null,
  duration      text not null,
  topic         text not null,
  details       text not null default '',
  budget        text,
  deadline      date,
  license       text not null default 'exclusive',
  status        text not null default 'new' check (status in ('new', 'quoted', 'in_progress', 'delivered', 'closed')),
  created_at    timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ═══════════════ Row Level Security ═══════════════
alter table public.profiles          enable row level security;
alter table public.categories        enable row level security;
alter table public.scripts           enable row level security;
alter table public.script_contents   enable row level security;  -- no policies on purpose
alter table public.bundles           enable row level security;
alter table public.bundle_items      enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.purchases         enable row level security;
alter table public.download_events   enable row level security;  -- server only
alter table public.custom_requests   enable row level security;
alter table public.contact_messages  enable row level security;  -- server only

-- Profiles: read your own; edit only your name (role is protected below).
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated, anon;
grant update (full_name) on public.profiles to authenticated;

-- Catalogue: public reads published rows; admins can read everything.
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select using (true);

drop policy if exists "scripts public read" on public.scripts;
create policy "scripts public read" on public.scripts for select using (is_published or public.is_admin());

-- Buyers can always see scripts they own, even after an exclusive sale unpublishes them.
drop policy if exists "scripts buyer read" on public.scripts;
create policy "scripts buyer read" on public.scripts for select using (
  exists (select 1 from public.purchases p where p.script_id = scripts.id and p.user_id = auth.uid())
);

drop policy if exists "bundles public read" on public.bundles;
create policy "bundles public read" on public.bundles for select using (is_published or public.is_admin());

drop policy if exists "bundle items public read" on public.bundle_items;
create policy "bundle items public read" on public.bundle_items for select using (true);

-- Orders & purchases: owners read their own. Writes happen with the service role only.
drop policy if exists "orders owner read" on public.orders;
create policy "orders owner read" on public.orders for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "order items owner read" on public.order_items;
create policy "order items owner read" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);

drop policy if exists "purchases owner read" on public.purchases;
create policy "purchases owner read" on public.purchases for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "custom requests owner read" on public.custom_requests;
create policy "custom requests owner read" on public.custom_requests for select using (user_id = auth.uid() or public.is_admin());

-- ═══════════════ Payment fulfilment (atomic, idempotent) ═══════════════
-- Called by the server after Razorpay signature verification.
-- Safe to call twice (client callback + webhook): only the first call does work.
create or replace function public.fulfil_order(p_order_id uuid, p_payment_id text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_order   public.orders%rowtype;
  v_item    record;
  v_script  uuid;
  v_conflict boolean := false;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then return 'not_found'; end if;
  if v_order.status in ('paid', 'review') then return 'already_fulfilled'; end if;

  for v_item in select * from public.order_items where order_id = p_order_id loop
    if v_item.bundle_id is not null then
      insert into public.purchases (user_id, script_id, order_id, license)
      select v_order.user_id, bi.script_id, p_order_id, 'standard'
      from public.bundle_items bi where bi.bundle_id = v_item.bundle_id
      on conflict (user_id, script_id) do nothing;
      update public.scripts s set sales_count = sales_count + 1, exclusive_available = false
      from public.bundle_items bi where bi.bundle_id = v_item.bundle_id and s.id = bi.script_id;

    elsif v_item.license = 'exclusive' then
      -- Claim the exclusive right atomically. If someone else got it first, grant
      -- nothing for this line (it belongs to the other buyer) and flag the order for refund.
      v_script := null;
      update public.scripts
         set exclusive_available = false, is_published = false, sales_count = sales_count + 1
       where id = v_item.script_id and exclusive_available = true
      returning id into v_script;
      if v_script is null then
        v_conflict := true;
      else
        insert into public.purchases (user_id, script_id, order_id, license)
        values (v_order.user_id, v_item.script_id, p_order_id, 'exclusive')
        on conflict (user_id, script_id) do update set license = 'exclusive', order_id = excluded.order_id;
      end if;

    else
      insert into public.purchases (user_id, script_id, order_id, license)
      values (v_order.user_id, v_item.script_id, p_order_id, 'standard')
      on conflict (user_id, script_id) do nothing;
      -- Once sold under a standard licence, a script can no longer be sold exclusively.
      update public.scripts set sales_count = sales_count + 1, exclusive_available = false
       where id = v_item.script_id;
    end if;
  end loop;

  update public.orders
     set status = case when v_conflict then 'review' else 'paid' end,
         razorpay_payment_id = p_payment_id,
         paid_at = now(),
         notes = case when v_conflict then 'Exclusive licence already claimed by another buyer. Refund or offer an alternative.' else notes end
   where id = p_order_id;

  return case when v_conflict then 'review' else 'paid' end;
end $$;

revoke all on function public.fulfil_order(uuid, text) from public, anon, authenticated;

-- ═══════════════ Storage ═══════════════
-- Private bucket for paid PDF/DOCX files. No policies = only the service role can access.
insert into storage.buckets (id, name, public)
values ('script-files', 'script-files', false)
on conflict (id) do update set public = false;

-- Public bucket for thumbnails (images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('thumbnails', 'thumbnails', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
