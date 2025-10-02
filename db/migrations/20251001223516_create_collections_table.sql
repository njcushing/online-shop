-- migrate:up
CREATE TABLE collections (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    UNIQUE (name)
);

-- migrate:down
DROP TABLE IF EXISTS collections;

