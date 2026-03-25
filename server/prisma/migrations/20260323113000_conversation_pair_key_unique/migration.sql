-- Add deterministic pair key for direct messages.
ALTER TABLE "Conversation" ADD COLUMN "pair_key" VARCHAR(64);

-- Fill pair key only for conversations with exactly two users.
WITH dm_pairs AS (
  SELECT
    rel."A" AS conversation_id,
    MIN(rel."B") AS min_user_id,
    MAX(rel."B") AS max_user_id,
    COUNT(*) AS participant_count
  FROM "_ConversationToUser" rel
  GROUP BY rel."A"
)
UPDATE "Conversation" c
SET "pair_key" = CONCAT(dm_pairs.min_user_id::text, ':', dm_pairs.max_user_id::text)
FROM dm_pairs
WHERE c."id" = dm_pairs.conversation_id
  AND dm_pairs.participant_count = 2;

-- Merge duplicate conversations by pair key and keep the oldest conversation.
WITH ranked AS (
  SELECT
    c."id",
    c."pair_key",
    ROW_NUMBER() OVER (PARTITION BY c."pair_key" ORDER BY c."id" ASC) AS rn,
    MIN(c."id") OVER (PARTITION BY c."pair_key") AS keep_id
  FROM "Conversation" c
  WHERE c."pair_key" IS NOT NULL
)
UPDATE "Message" m
SET "conversation_id" = ranked.keep_id
FROM ranked
WHERE m."conversation_id" = ranked."id"
  AND ranked.rn > 1;

WITH ranked AS (
  SELECT
    c."id",
    c."pair_key",
    ROW_NUMBER() OVER (PARTITION BY c."pair_key" ORDER BY c."id" ASC) AS rn
  FROM "Conversation" c
  WHERE c."pair_key" IS NOT NULL
)
DELETE FROM "Conversation" c
USING ranked
WHERE c."id" = ranked."id"
  AND ranked.rn > 1;

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_pair_key_key" UNIQUE ("pair_key");
