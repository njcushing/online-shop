-- migrate:up
CREATE TABLE promotion_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS promotion_types;
