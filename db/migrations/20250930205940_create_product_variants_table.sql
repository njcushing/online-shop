-- migrate:up
CREATE TABLE product_variants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name text NOT NULL,
    sku text NOT NULL UNIQUE,
    can_subscribe boolean DEFAULT false,
    price_current numeric(10,2) NOT NULL,
    price_base numeric(10,2) NOT NULL,
    subscription_discount_percentage numeric(10,4) DEFAULT 0,
    stock int NOT NULL DEFAULT 0,
    allowance_override int NULL,
    active boolean NOT NULL,
    release_date timestamptz NOT NULL DEFAULT now(),
    attribute_hash text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE (id, product_id),
    CONSTRAINT unique_product_variant_attribute_combination_per_product
        UNIQUE (product_id, attribute_hash)
);

-- migrate:down
DROP TABLE IF EXISTS product_variants;

