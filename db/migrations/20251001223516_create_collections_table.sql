-- migrate:up
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    UNIQUE (name)
);

-- migrate:down
DROP TABLE IF EXISTS collections;

