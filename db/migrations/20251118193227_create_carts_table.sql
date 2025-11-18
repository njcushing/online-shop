-- migrate:up
CREATE TABLE carts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    refresh_token_id uuid NOT NULL REFERENCES refresh_tokens(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS carts;
