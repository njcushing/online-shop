-- migrate:up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    allowance INT NOT NULL DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    release_date TIMESTAMPTZ
);

-- migrate:down
DROP TABLE IF EXISTS products;
DROP EXTENSION IF EXISTS "uuid-ossp";
