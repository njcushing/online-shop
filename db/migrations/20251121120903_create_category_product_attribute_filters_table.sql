-- migrate:up
CREATE TABLE category_product_attribute_filters (
    category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    product_attribute_id uuid NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (category_id, product_attribute_id)
);

-- migrate:down
DROP TABLE IF EXISTS category_product_attribute_filters;
