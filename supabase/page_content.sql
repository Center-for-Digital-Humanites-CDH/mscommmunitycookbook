-- Editable text and images for the site's pages.
-- Each row overrides one field; anything without a row uses the default in src/content/pages.ts.
create table if not exists page_content (
  page text not null,
  key text not null,
  value text not null,
  updated_at timestamptz not null default now(),
  primary key (page, key)
);

alter table page_content enable row level security;

create policy "Anyone can read page content"
  on page_content for select
  using (true);

create policy "Signed-in admins can edit page content"
  on page_content for all
  to authenticated
  using (true)
  with check (true);
