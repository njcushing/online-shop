-- migrate:up
CREATE TABLE product_attribute_value_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS product_attribute_value_types;
