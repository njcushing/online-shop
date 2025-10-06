-- migrate:up
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    subscription_status_type_id uuid NOT NULL REFERENCES subscription_status_types(id) ON DELETE RESTRICT,
    subscription_frequency_id uuid NOT NULL REFERENCES subscription_frequencies(id) ON DELETE RESTRICT,
    unit_price_at_subscription numeric(10,2) NOT NULL,
    quantity int NOT NULL CHECK (quantity > 0),
    next_expected_delivery_date timestamptz NOT NULL,
    cancelled_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE (user_id, product_variant_id)
);

ALTER TABLE orders ADD COLUMN subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE orders DROP COLUMN IF EXISTS subscription_id;
DROP TABLE IF EXISTS subscriptions;
