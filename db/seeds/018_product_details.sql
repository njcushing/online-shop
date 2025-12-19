BEGIN;

CREATE TEMP TABLE product_details_csv (
    product_slug text,
    name text,
    value text
);

COPY product_details_csv (product_slug, name, value)
FROM '/db/seeds/data/product_details.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO product_details (product_id, name, value)
SELECT p.id, pd.name, pd.value
FROM product_details_csv pd
JOIN products p ON p.slug = pd.product_slug;

COMMIT;
