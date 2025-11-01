-- migrate:up
CREATE TABLE product_variant_attributes (
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    product_attribute_id uuid NOT NULL REFERENCES product_attributes(id) ON DELETE RESTRICT,
    product_attribute_value_code text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (product_variant_id, product_attribute_id),
    CONSTRAINT fk_variant_belongs_to_product
        FOREIGN KEY (product_variant_id, product_id)
        REFERENCES product_variants(id, product_id) ON DELETE CASCADE,
    CONSTRAINT fk_attribute_value_matches_attribute
        FOREIGN KEY (product_attribute_id, product_attribute_value_code)
        REFERENCES product_attribute_values (product_attribute_id, code) ON DELETE RESTRICT,
    CONSTRAINT fk_attribute_id_belongs_to_product_attribute_order
        FOREIGN KEY (product_id, product_attribute_id)
        REFERENCES product_attribute_orders (product_id, product_attribute_id) ON DELETE RESTRICT
);

-- migrate:down
DROP TABLE IF EXISTS product_variant_attributes;
