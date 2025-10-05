-- migrate:up
CREATE TABLE order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    unit_price_base numeric(10,2) NOT NULL,
    unit_price_paid numeric(10,2) NOT NULL,
    quantity int NOT NULL CHECK (quantity > 0),
    subscription_frequency_id uuid REFERENCES subscription_frequencies(id) ON DELETE RESTRICT,
    subscription_discount numeric(10,2),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- migrate:down
DROP TABLE IF EXISTS order_items;

