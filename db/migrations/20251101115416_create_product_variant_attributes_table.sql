-- migrate:up
CREATE TABLE product_variant_attributes (
    product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    product_attribute_id uuid NOT NULL REFERENCES product_attributes(id) ON DELETE RESTRICT,
    product_attribute_value_code text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (product_variant_id, product_attribute_id),
    CONSTRAINT fk_attribute_value_matches_attribute
        FOREIGN KEY (product_attribute_id, product_attribute_value_code)
        REFERENCES product_attribute_values (product_attribute_id, code) ON DELETE RESTRICT
);

-- migrate:down
DROP TABLE IF EXISTS product_variant_attributes;
