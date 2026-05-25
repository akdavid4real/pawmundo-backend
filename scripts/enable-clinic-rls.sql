ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public approved clinic search" ON public.clinics;
CREATE POLICY "Allow public approved clinic search"
  ON public.clinics
  FOR SELECT
  TO anon, authenticated
  USING ("isActive" = true AND "verificationStatus" = 'approved');

DROP POLICY IF EXISTS "Allow users to view own clinic memberships" ON public.clinic_memberships;
CREATE POLICY "Allow users to view own clinic memberships"
  ON public.clinic_memberships
  FOR SELECT
  TO authenticated
  USING ("userId" = auth.uid()::text);

DROP POLICY IF EXISTS "Allow service role full clinic access" ON public.clinics;
CREATE POLICY "Allow service role full clinic access"
  ON public.clinics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full clinic membership access" ON public.clinic_memberships;
CREATE POLICY "Allow service role full clinic membership access"
  ON public.clinic_memberships
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
