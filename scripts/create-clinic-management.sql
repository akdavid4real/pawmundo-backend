ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'clinic_admin';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ClinicVerificationStatus') THEN
    CREATE TYPE "ClinicVerificationStatus" AS ENUM ('pending', 'approved', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ClinicMembershipRole') THEN
    CREATE TYPE "ClinicMembershipRole" AS ENUM ('clinic_admin', 'vet');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ClinicMembershipStatus') THEN
    CREATE TYPE "ClinicMembershipStatus" AS ENUM ('pending', 'active', 'suspended', 'removed');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "clinics" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "registrationNumber" TEXT,
  "verificationDocuments" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "verificationStatus" "ClinicVerificationStatus" NOT NULL DEFAULT 'pending',
  "rejectionReason" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "clinic_memberships" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clinicId" TEXT NOT NULL REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "role" "ClinicMembershipRole" NOT NULL,
  "status" "ClinicMembershipStatus" NOT NULL DEFAULT 'pending',
  "invitedById" TEXT REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "approvedById" TEXT REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "approvedAt" TIMESTAMP(3),
  "removedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "clinic_memberships_clinicId_userId_key"
  ON "clinic_memberships"("clinicId", "userId");
CREATE INDEX IF NOT EXISTS "clinics_verificationStatus_isActive_idx"
  ON "clinics"("verificationStatus", "isActive");
CREATE INDEX IF NOT EXISTS "clinics_name_idx"
  ON "clinics"("name");
CREATE INDEX IF NOT EXISTS "clinic_memberships_userId_status_idx"
  ON "clinic_memberships"("userId", "status");
CREATE INDEX IF NOT EXISTS "clinic_memberships_clinicId_status_role_idx"
  ON "clinic_memberships"("clinicId", "status", "role");
CREATE INDEX IF NOT EXISTS "clinic_memberships_invitedById_idx"
  ON "clinic_memberships"("invitedById");
CREATE INDEX IF NOT EXISTS "clinic_memberships_approvedById_idx"
  ON "clinic_memberships"("approvedById");

ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "clinicId" TEXT;
ALTER TABLE "consultations" ADD COLUMN IF NOT EXISTS "clinicId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appointments_clinicId_fkey'
  ) THEN
    ALTER TABLE "appointments"
      ADD CONSTRAINT "appointments_clinicId_fkey"
      FOREIGN KEY ("clinicId") REFERENCES "clinics"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'consultations_clinicId_fkey'
  ) THEN
    ALTER TABLE "consultations"
      ADD CONSTRAINT "consultations_clinicId_fkey"
      FOREIGN KEY ("clinicId") REFERENCES "clinics"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "appointments_clinicId_appointmentDate_idx"
  ON "appointments"("clinicId", "appointmentDate");
CREATE INDEX IF NOT EXISTS "consultations_clinicId_status_idx"
  ON "consultations"("clinicId", "status");
