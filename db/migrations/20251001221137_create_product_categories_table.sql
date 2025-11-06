-- migrate:up
CREATE TABLE category_products (
    category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (category_id, product_id)
);

-- migrate:down
DROP TABLE IF EXISTS category_products;

