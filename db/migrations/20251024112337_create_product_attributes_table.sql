-- migrate:up
CREATE TABLE product_attributes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    title text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);


-- migrate:down
DROP TABLE IF EXISTS product_attributes;
