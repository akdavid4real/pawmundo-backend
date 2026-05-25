-- Lock public application tables from Supabase Data API access.
-- Backend access remains owned by the server database/service credentials.

alter table public._prisma_migrations enable row level security;
alter table public.activities enable row level security;
alter table public.appointments enable row level security;
alter table public.consultation_messages enable row level security;
alter table public.consultation_notes enable row level security;
alter table public.consultations enable row level security;
alter table public.events enable row level security;
alter table public.forum_likes enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;
alter table public.health_records enable row level security;
alter table public.insurance_claims enable row level security;
alter table public.insurances enable row level security;
alter table public.medications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.pets enable row level security;
alter table public.prescriptions enable row level security;
alter table public.symptom_checks enable row level security;
alter table public.users enable row level security;

revoke all on table public._prisma_migrations from anon, authenticated;
revoke all on table public.activities from anon, authenticated;
revoke all on table public.appointments from anon, authenticated;
revoke all on table public.consultation_messages from anon, authenticated;
revoke all on table public.consultation_notes from anon, authenticated;
revoke all on table public.consultations from anon, authenticated;
revoke all on table public.events from anon, authenticated;
revoke all on table public.forum_likes from anon, authenticated;
revoke all on table public.forum_posts from anon, authenticated;
revoke all on table public.forum_replies from anon, authenticated;
revoke all on table public.health_records from anon, authenticated;
revoke all on table public.insurance_claims from anon, authenticated;
revoke all on table public.insurances from anon, authenticated;
revoke all on table public.medications from anon, authenticated;
revoke all on table public.notification_preferences from anon, authenticated;
revoke all on table public.notifications from anon, authenticated;
revoke all on table public.pets from anon, authenticated;
revoke all on table public.prescriptions from anon, authenticated;
revoke all on table public.symptom_checks from anon, authenticated;
revoke all on table public.users from anon, authenticated;
