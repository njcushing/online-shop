-- migrate:up
CREATE TABLE collections (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE (name)
);

-- migrate:down
DROP TABLE IF EXISTS collections;

