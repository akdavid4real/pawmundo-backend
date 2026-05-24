# Fix Log

This file tracks the issues fixed from the backend review and what changed in code.

## Completed Fixes

1. Secured internal-only endpoints.
   - Protected `seed`, consultation `debug`, and consultation `test` endpoints with JWT auth and admin role checks.
   - Added non-production runtime protection so these endpoints are disabled in production even for authenticated users.

2. Enforced pet ownership on write and read paths.
   - Added pet ownership validation to appointment creation and pet reassignment updates.
   - Added pet ownership validation to insurance creation, filtering by `petId`, and pet reassignment updates.
   - Added pet ownership validation to event creation and updates when `petId` is supplied.
   - Added pet ownership validation to activity creation, activity reads by pet, daily stats, and delete.

3. Fixed consultation realtime wiring.
   - Registered `ConsultationsGateway` in the consultations module.
   - Accepted both `vet` and `veterinarian` in websocket registration payloads while still requiring authenticated vet users.

4. Enabled scheduled reminder execution.
   - Registered `ScheduleModule.forRoot()` in the app module so `@Cron()` handlers can run.

5. Normalized enum contract mismatches.
   - Mapped consultation status `in-progress` to Prisma `in_progress`.
   - Mapped consultation payment status `pending` to Prisma `pending_payment`.
   - Mapped insurance status aliases like `active` to Prisma enum values like `insurance_active`.
   - Mapped activity type `other` to Prisma enum `activity_other`.
   - Aligned notification DTO types with the actual Prisma enum values.
   - Fixed event category filtering to map public values such as `appointment` to Prisma values like `event_appointment`.

6. Hardened startup configuration.
   - Removed the insecure JWT secret fallback and now fail fast if `JWT_SECRET` is missing.
   - Replaced `process.exit(1)` on Prisma connection failure with a thrown startup error.
   - Made SMTP configuration explicit: production now fails fast when SMTP is incomplete, and non-production logs a warning instead of silently using placeholder credentials.

7. Made unit tests database-safe by default.
   - Switched normal `jest` runs to `test/setup-unit.ts`, which injects a dummy local-only `DATABASE_URL` and does not depend on any real database.
   - Kept `test/setup.ts` for `test:e2e` only and tightened it so e2e tests only run against an explicitly local dedicated test database.
   - Added and expanded mock-based unit tests for appointments, insurance, events, consultations, websocket registration, and internal controller protections.

## Verification Focus

The highest-risk areas to verify after these fixes are:

1. Authenticated access to `seed`, `consultations/debug/:id`, and `test/consultations/:id`.
2. Appointment, insurance, event, and activity requests using another user's `petId`.
3. Consultation websocket vet registration and room flows.
4. Health reminder cron startup in an environment where the Nest scheduler is enabled.
5. JWT startup behavior when `JWT_SECRET` is missing.
6. Unit tests should be runnable with no real database, while `test:e2e` should refuse any live or shared database URL.
