BEGIN;

CREATE TEMP TABLE category_product_attribute_filters_csv (
    category_slug text,
    product_attribute_code text
);

COPY category_product_attribute_filters_csv (category_slug, product_attribute_code)
FROM '/db/seeds/data/category_product_attribute_filters.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO category_product_attribute_filters (category_id, product_attribute_id)
SELECT c.id, pa.id
FROM category_product_attribute_filters_csv cpaf
JOIN categories c ON c.slug = cpaf.category_slug
JOIN product_attributes pa ON pa.code = cpaf.product_attribute_code;

COMMIT;
