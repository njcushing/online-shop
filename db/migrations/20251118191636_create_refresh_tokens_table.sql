-- migrate:up
CREATE TABLE refresh_tokens (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    token text UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz,
    replaced_by text,
    ip_address text,
    user_agent text
);

-- migrate:down
DROP TABLE IF EXISTS refresh_tokens;
