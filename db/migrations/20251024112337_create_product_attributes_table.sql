-- migrate:up
CREATE TABLE product_attributes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    title text NOT NULL,
    product_attribute_value_type_id uuid NOT NULL REFERENCES product_attribute_value_types(id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS product_attributes;
