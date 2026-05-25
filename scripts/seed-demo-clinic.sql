DO $$
DECLARE
  clinic_id TEXT;
  platform_admin_id TEXT;
  clinic_admin_id TEXT;
  vet_id TEXT;
BEGIN
  SELECT id INTO clinic_id
  FROM public.clinics
  WHERE name = 'PawMundo Demo Clinic'
  LIMIT 1;

  IF clinic_id IS NULL THEN
    INSERT INTO public.clinics (
      id,
      name,
      email,
      phone,
      address,
      "registrationNumber",
      "verificationDocuments",
      "verificationStatus",
      "isActive",
      "updatedAt"
    )
    VALUES (
      gen_random_uuid()::text,
      'PawMundo Demo Clinic',
      'clinic@pawmundo.com',
      '+1 555 400 1000',
      '100 PawMundo Avenue',
      'PM-DEMO-001',
      ARRAY[]::TEXT[],
      'approved',
      true,
      now()
    )
    RETURNING id INTO clinic_id;
  ELSE
    UPDATE public.clinics
    SET
      email = 'clinic@pawmundo.com',
      phone = '+1 555 400 1000',
      address = '100 PawMundo Avenue',
      "registrationNumber" = 'PM-DEMO-001',
      "verificationStatus" = 'approved',
      "isActive" = true,
      "rejectionReason" = NULL,
      "updatedAt" = now()
    WHERE id = clinic_id;
  END IF;

  INSERT INTO public.users (
    id,
    email,
    password,
    "firstName",
    "lastName",
    role,
    "isEmailVerified",
    "isActive",
    "updatedAt"
  )
  VALUES (
    gen_random_uuid()::text,
    'admin@pawmundo.com',
    '$2b$12$K/KADPpBQjMdND2Wv5H/quQYl1KFwJUWdapJroMlbaAUUocfeMeVa',
    'Platform',
    'Admin',
    'admin',
    true,
    true,
    now()
  )
  ON CONFLICT (email) DO UPDATE
  SET
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    role = 'admin',
    "isEmailVerified" = true,
    "isActive" = true,
    "updatedAt" = now()
  RETURNING id INTO platform_admin_id;

  INSERT INTO public.users (
    id,
    email,
    password,
    "firstName",
    "lastName",
    role,
    phone,
    "isEmailVerified",
    "isActive",
    "updatedAt"
  )
  VALUES (
    gen_random_uuid()::text,
    'clinicadmin@pawmundo.com',
    '$2b$12$kopkcZIcczHfUKP1Eqj/WusihdxnM3FPLiZv/5kSiErKIZ8xKOghi',
    'Clinic',
    'Admin',
    'clinic_admin',
    '+1 555 400 1001',
    true,
    true,
    now()
  )
  ON CONFLICT (email) DO UPDATE
  SET
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    role = 'clinic_admin',
    phone = EXCLUDED.phone,
    "isEmailVerified" = true,
    "isActive" = true,
    "updatedAt" = now()
  RETURNING id INTO clinic_admin_id;

  INSERT INTO public.users (
    id,
    email,
    password,
    "firstName",
    "lastName",
    role,
    phone,
    "isEmailVerified",
    "isActive",
    "updatedAt"
  )
  VALUES (
    gen_random_uuid()::text,
    'drsmith@pawmundo.com',
    '$2b$12$9SCk3HDxbX//NCcdS59C6OvYz0FwIK912iRQa6VqrhPreaqiLuV1q',
    'Dr.',
    'Smith',
    'vet',
    '+1 555 400 1002',
    true,
    true,
    now()
  )
  ON CONFLICT (email) DO UPDATE
  SET
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    role = 'vet',
    phone = EXCLUDED.phone,
    "isEmailVerified" = true,
    "isActive" = true,
    "updatedAt" = now()
  RETURNING id INTO vet_id;

  INSERT INTO public.clinic_memberships (
    id,
    "clinicId",
    "userId",
    role,
    status,
    "approvedById",
    "approvedAt",
    "updatedAt"
  )
  VALUES (
    gen_random_uuid()::text,
    clinic_id,
    clinic_admin_id,
    'clinic_admin',
    'active',
    clinic_admin_id,
    now(),
    now()
  )
  ON CONFLICT ("clinicId", "userId") DO UPDATE
  SET
    role = 'clinic_admin',
    status = 'active',
    "removedAt" = NULL,
    "approvedById" = clinic_admin_id,
    "approvedAt" = now(),
    "updatedAt" = now();

  INSERT INTO public.clinic_memberships (
    id,
    "clinicId",
    "userId",
    role,
    status,
    "invitedById",
    "approvedById",
    "approvedAt",
    "updatedAt"
  )
  VALUES (
    gen_random_uuid()::text,
    clinic_id,
    vet_id,
    'vet',
    'active',
    clinic_admin_id,
    clinic_admin_id,
    now(),
    now()
  )
  ON CONFLICT ("clinicId", "userId") DO UPDATE
  SET
    role = 'vet',
    status = 'active',
    "removedAt" = NULL,
    "invitedById" = clinic_admin_id,
    "approvedById" = clinic_admin_id,
    "approvedAt" = now(),
    "updatedAt" = now();
END $$;
