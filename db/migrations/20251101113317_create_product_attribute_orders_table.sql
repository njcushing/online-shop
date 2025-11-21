-- migrate:up
CREATE TABLE product_attribute_orders (
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_attribute_id uuid NOT NULL REFERENCES product_attributes(id) ON DELETE RESTRICT,
    position int NOT NULL CHECK (position >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (product_id, product_attribute_id),
    UNIQUE (product_id, position)
);

-- migrate:down
DROP TABLE IF EXISTS product_attribute_orders;
