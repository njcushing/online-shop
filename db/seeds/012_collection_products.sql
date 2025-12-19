BEGIN;

CREATE TEMP TABLE collection_products_csv (
    collection_slug text,
    product_slug text,
    name text,
    position int
);

COPY collection_products_csv (collection_slug, product_slug, name, position)
FROM '/db/seeds/data/collection_products.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO collection_products (collection_id, product_id, name, position)
SELECT c.id, p.id, cp.name, cp.position
FROM collection_products_csv cp
JOIN collections c ON c.slug = cp.collection_slug
JOIN products p ON p.slug = cp.product_slug;

COMMIT;
