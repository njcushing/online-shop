-- migrate:up
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    UNIQUE (parent_id, name)
);

-- migrate:down
DROP TABLE IF EXISTS categories;

