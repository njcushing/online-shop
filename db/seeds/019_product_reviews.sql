BEGIN;

CREATE TEMP TABLE product_reviews_csv (
    product_slug text,
    product_variant_sku text,
    title text,
    description text,
    rating int
);

COPY product_reviews_csv (product_slug, product_variant_sku, title, description, rating)
FROM '/db/seeds/data/product_reviews.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO product_reviews (product_id, product_variant_id, title, description, rating)
SELECT p.id, pv.id, pr.title, pr.description, pr.rating
FROM product_reviews_csv pr
JOIN products p ON p.slug = pr.product_slug
LEFT JOIN product_variants pv ON pv.sku = pr.product_variant_sku;

COMMIT;
