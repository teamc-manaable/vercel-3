-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  full_name text,
  department text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trainings table
create table if not exists public.trainings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  start_date date not null,
  duration text not null,
  max_students integer not null,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create lessons table
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  training_id uuid references public.trainings(id) on delete cascade,
  title text not null,
  date date not null,
  start_time time not null,
  duration text not null,
  zoom_link text,
  completion_threshold integer not null default 80,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create enrollments table
create table if not exists public.enrollments (
  id uuid default gen_random_uuid() primary key,
  training_id uuid references public.trainings(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  enrollment_date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(training_id, student_id)
);

-- Create attendance table
create table if not exists public.attendance (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  join_time timestamp with time zone not null,
  leave_time timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.trainings enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.attendance enable row level security;

-- Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Policies for trainings (using the existing ones from previous migration)

-- Policies for lessons
create policy "Anyone can view lessons"
  on public.lessons for select
  to authenticated
  using (true);

create policy "Admins can manage lessons"
  on public.lessons for all
  to authenticated
  using (
    exists (
      select 1 from admins
      where admins.email = auth.jwt()->>'email'
    )
  );

-- Policies for enrollments
create policy "Anyone can view enrollments"
  on public.enrollments for select
  to authenticated
  using (true);

create policy "Admins can manage enrollments"
  on public.enrollments for all
  to authenticated
  using (
    exists (
      select 1 from admins
      where admins.email = auth.jwt()->>'email'
    )
  );

-- Policies for attendance
create policy "Anyone can view attendance"
  on public.attendance for select
  to authenticated
  using (true);

create policy "Admins can manage attendance"
  on public.attendance for all
  to authenticated
  using (
    exists (
      select 1 from admins
      where admins.email = auth.jwt()->>'email'
    )
  );

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
grant all on public.trainings to anon, authenticated;
grant all on public.lessons to anon, authenticated;
grant all on public.enrollments to anon, authenticated;
grant all on public.attendance to anon, authenticated;