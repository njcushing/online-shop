-- migrate:up
CREATE TABLE cart_promotions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    promotion_id uuid NOT NULL REFERENCES promotions(id) ON DELETE RESTRICT,
    discount_value numeric(10,2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS cart_promotions;
