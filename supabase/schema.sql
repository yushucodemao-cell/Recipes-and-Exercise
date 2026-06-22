-- 好吃好练 数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件

-- 启用 UUID
create extension if not exists "uuid-ossp";

-- 室友空间
create table households (
  id uuid primary key default uuid_generate_v4(),
  name text not null default '我们的家',
  invite_code text unique not null,
  created_at timestamptz default now()
);

-- 用户资料（关联 auth.users）
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  household_id uuid references households(id) on delete set null,
  created_at timestamptz default now()
);

-- 食材库
create table ingredients (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  name text not null,
  category text not null default '其他',
  unit text not null default '份',
  shelf_life_days int not null default 7,
  is_staple boolean not null default false,
  created_at timestamptz default now()
);

-- 菜谱
create table recipes (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade,
  name text not null,
  meal_type text not null default '晚餐',
  ingredient_ids uuid[] not null default '{}',
  servings int not null default 2,
  created_at timestamptz default now()
);

-- 周计划
create table meal_plans (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  week_start date not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  unique(household_id, week_start)
);

-- 本周选中的食材
create table meal_plan_ingredients (
  id uuid primary key default uuid_generate_v4(),
  meal_plan_id uuid references meal_plans(id) on delete cascade not null,
  ingredient_id uuid references ingredients(id) on delete cascade not null,
  unique(meal_plan_id, ingredient_id)
);

-- 周计划中的每餐
create table meal_plan_items (
  id uuid primary key default uuid_generate_v4(),
  meal_plan_id uuid references meal_plans(id) on delete cascade not null,
  day_of_week int not null check (day_of_week between 0 and 6),
  meal_type text not null default '晚餐',
  recipe_id uuid references recipes(id) on delete set null,
  recipe_name text not null,
  cook_assignee uuid references profiles(id),
  created_at timestamptz default now()
);

-- 采购清单
create table shopping_items (
  id uuid primary key default uuid_generate_v4(),
  meal_plan_id uuid references meal_plans(id) on delete cascade not null,
  ingredient_id uuid references ingredients(id) on delete set null,
  name text not null,
  quantity text not null default '1',
  unit text not null default '份',
  shop_type text not null check (shop_type in ('friday_bulk', 'weekday_online')),
  checked boolean not null default false,
  created_at timestamptz default now()
);

-- 每日健康记录
create table health_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  household_id uuid references households(id) on delete cascade not null,
  log_date date not null,
  weight numeric(5,2),
  mood int check (mood between 1 and 5),
  mood_note text,
  period_active boolean default false,
  period_symptoms text,
  sleep_start time,
  sleep_end time,
  sleep_quality int check (sleep_quality between 1 and 5),
  is_private boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, log_date)
);

-- 运动记录
create table exercise_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  household_id uuid references households(id) on delete cascade not null,
  log_date date not null,
  exercise_type text not null,
  duration_minutes int not null default 30,
  notes text,
  is_private boolean not null default false,
  created_at timestamptz default now()
);

-- RLS 策略
alter table households enable row level security;
alter table profiles enable row level security;
alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table meal_plans enable row level security;
alter table meal_plan_ingredients enable row level security;
alter table meal_plan_items enable row level security;
alter table shopping_items enable row level security;
alter table health_logs enable row level security;
alter table exercise_logs enable row level security;

-- 获取当前用户的 household_id
create or replace function get_my_household_id()
returns uuid as $$
  select household_id from profiles where id = auth.uid()
$$ language sql security definer stable;

-- households: 成员可读写自己的空间
create policy "household_select" on households for select
  using (id = get_my_household_id());
create policy "household_insert" on households for insert
  with check (true);
create policy "household_update" on households for update
  using (id = get_my_household_id());

-- profiles: 自己可读写，同室友可见基本信息
create policy "profile_select_own" on profiles for select
  using (id = auth.uid() or household_id = get_my_household_id());
create policy "profile_insert" on profiles for insert
  with check (id = auth.uid());
create policy "profile_update" on profiles for update
  using (id = auth.uid());

-- 通过邀请码查找空间（注册时用，仅返回匹配行）
create or replace function get_household_by_invite(code text)
returns setof households as $$
  select * from households where invite_code = upper(code) limit 1;
$$ language sql security definer;

-- 创建空间并把当前用户加入空间，避免 RLS 在创建空间时卡住
create or replace function create_household_for_current_user(household_name text, code text)
returns households as $$
declare
  new_household households;
begin
  insert into households (name, invite_code)
  values (coalesce(nullif(household_name, ''), '我们的家'), upper(code))
  returning * into new_household;

  insert into profiles (id, display_name, household_id)
  values (
    auth.uid(),
    coalesce(
      nullif(auth.jwt()->'user_metadata'->>'display_name', ''),
      split_part(coalesce(auth.jwt()->>'email', ''), '@', 1),
      '新朋友'
    ),
    new_household.id
  )
  on conflict (id) do update set household_id = excluded.household_id;

  return new_household;
end;
$$ language plpgsql security definer;

-- ingredients, recipes: 室友共享
create policy "ingredients_all" on ingredients for all
  using (household_id = get_my_household_id())
  with check (household_id = get_my_household_id());

create policy "recipes_all" on recipes for all
  using (household_id = get_my_household_id())
  with check (household_id = get_my_household_id());

-- meal plans: 室友共享
create policy "meal_plans_all" on meal_plans for all
  using (household_id = get_my_household_id())
  with check (household_id = get_my_household_id());

create policy "meal_plan_ingredients_all" on meal_plan_ingredients for all
  using (meal_plan_id in (select id from meal_plans where household_id = get_my_household_id()))
  with check (meal_plan_id in (select id from meal_plans where household_id = get_my_household_id()));

create policy "meal_plan_items_all" on meal_plan_items for all
  using (meal_plan_id in (select id from meal_plans where household_id = get_my_household_id()))
  with check (meal_plan_id in (select id from meal_plans where household_id = get_my_household_id()));

create policy "shopping_items_all" on shopping_items for all
  using (meal_plan_id in (select id from meal_plans where household_id = get_my_household_id()))
  with check (meal_plan_id in (select id from meal_plans where household_id = get_my_household_id()));

-- health_logs: 自己的全可见，室友的仅非私密可见
create policy "health_logs_select" on health_logs for select
  using (
    user_id = auth.uid()
    or (household_id = get_my_household_id() and is_private = false)
  );
create policy "health_logs_insert" on health_logs for insert
  with check (user_id = auth.uid() and household_id = get_my_household_id());
create policy "health_logs_update" on health_logs for update
  using (user_id = auth.uid());
create policy "health_logs_delete" on health_logs for delete
  using (user_id = auth.uid());

-- exercise_logs: 同上
create policy "exercise_logs_select" on exercise_logs for select
  using (
    user_id = auth.uid()
    or (household_id = get_my_household_id() and is_private = false)
  );
create policy "exercise_logs_insert" on exercise_logs for insert
  with check (user_id = auth.uid() and household_id = get_my_household_id());
create policy "exercise_logs_update" on exercise_logs for update
  using (user_id = auth.uid());
create policy "exercise_logs_delete" on exercise_logs for delete
  using (user_id = auth.uid());

-- 注册时自动创建 profile
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      split_part(coalesce(new.email, ''), '@', 1),
      '新朋友'
    )
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
