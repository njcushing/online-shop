-- migrate:up
CREATE TABLE cart_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity int NOT NULL CHECK (quantity >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_variant_id ON cart_items(product_variant_id);

-- migrate:down
DROP TABLE IF EXISTS cart_items;
