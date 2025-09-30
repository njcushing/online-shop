-- migrate:up
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    can_subscribe BOOLEAN DEFAULT false,
    price_current NUMERIC(10,2) NOT NULL,
    price_base NUMERIC(10,2) NOT NULL,
    subscription_discount_percentage INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    allowance_override INT NULL,
    release_date TIMESTAMPTZ
);

-- migrate:down
DROP TABLE IF EXISTS product_variants;

