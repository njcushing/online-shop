-- migrate:up
CREATE TABLE product_collections (
    collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, product_id)
);

-- migrate:down
DROP TABLE IF EXISTS product_collections;

