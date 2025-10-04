-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    slug text NOT NULL UNIQUE,
    allowance int NOT NULL DEFAULT 0,
    tags text[] DEFAULT '{}',
    release_date timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS products;
DROP EXTENSION IF EXISTS "uuid-ossp";
