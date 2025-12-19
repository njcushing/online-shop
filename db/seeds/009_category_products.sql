BEGIN;

CREATE TEMP TABLE category_products_csv (
    category_slug text,
    product_slug text
);

COPY category_products_csv (category_slug, product_slug)
FROM '/db/seeds/data/category_products.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO category_products (category_id, product_id)
SELECT c.id, p.id
FROM category_products_csv cp
JOIN categories c ON c.slug = cp.category_slug
JOIN products p ON p.slug = cp.product_slug;

COMMIT;
