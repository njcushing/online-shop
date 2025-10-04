-- migrate:up
CREATE TABLE product_variants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name text NOT NULL,
    sku text NOT NULL UNIQUE,
    can_subscribe boolean DEFAULT false,
    price_current numeric(10,2) NOT NULL,
    price_base numeric(10,2) NOT NULL,
    subscription_discount_percentage int DEFAULT 0,
    stock int NOT NULL DEFAULT 0,
    allowance_override int NULL,
    release_date timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS product_variants;

