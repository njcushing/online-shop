-- migrate:up
CREATE TABLE product_categories (
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (product_id, category_id)
);

-- migrate:down
DROP TABLE IF EXISTS product_categories;

