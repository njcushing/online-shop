-- migrate:up
CREATE TABLE collection_products (
    collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name text,
    position int NOT NULL CHECK (position >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (collection_id, product_id)
);

-- migrate:down
DROP TABLE IF EXISTS product_collections;

