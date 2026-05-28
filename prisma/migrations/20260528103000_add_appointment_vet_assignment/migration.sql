-- Add real vet assignment to clinic appointments and support no-show status transitions.
ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'no_show';

ALTER TABLE "appointments"
ADD COLUMN IF NOT EXISTS "assignedVetId" TEXT;

ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_assignedVetId_fkey"
FOREIGN KEY ("assignedVetId") REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "appointments_assignedVetId_appointmentDate_idx"
ON "appointments"("assignedVetId", "appointmentDate");
