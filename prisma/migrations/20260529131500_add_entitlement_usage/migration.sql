-- Track monthly free-tier usage for metered AI features.
CREATE TYPE "EntitlementFeature" AS ENUM ('ai_chat', 'symptom_checker');

CREATE TABLE "entitlement_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" "EntitlementFeature" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entitlement_usage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "entitlement_usage_userId_feature_periodStart_idx" ON "entitlement_usage"("userId", "feature", "periodStart");
CREATE INDEX "entitlement_usage_feature_periodStart_idx" ON "entitlement_usage"("feature", "periodStart");

ALTER TABLE "entitlement_usage" ADD CONSTRAINT "entitlement_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
