-- migrate:up
CREATE TABLE carts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    token uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS carts;
