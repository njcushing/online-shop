-- migrate:up
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
)

-- migrate:down
DROP TABLE IF EXISTS carts;
