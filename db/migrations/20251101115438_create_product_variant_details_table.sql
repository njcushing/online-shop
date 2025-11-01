-- migrate:up
CREATE TABLE product_variant_details (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    name text NOT NULL,
    value text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE (product_variant_id, name)
);

-- migrate:down
DROP TABLE IF EXISTS product_variant_details;
