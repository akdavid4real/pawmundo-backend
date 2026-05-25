create table if not exists public.pet_photos (
  id text primary key,
  "petId" text not null,
  url text not null,
  caption text,
  "createdAt" timestamp(3) not null default current_timestamp,
  constraint pet_photos_petId_fkey
    foreign key ("petId")
    references public.pets(id)
    on update cascade
    on delete restrict
);

create index if not exists pet_photos_petId_createdAt_idx
  on public.pet_photos ("petId", "createdAt" desc);

alter table public.pet_photos enable row level security;
revoke all on table public.pet_photos from anon, authenticated;
