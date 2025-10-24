-- migrate:up
CREATE TABLE product_variant_attributes (
    product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    product_attribute_id uuid NOT NULL REFERENCES product_attributes(id) ON DELETE RESTRICT,
    value text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (product_variant_id, product_attribute_id)
);

-- migrate:down
DROP TABLE IF EXISTS product_variant_attributes;
