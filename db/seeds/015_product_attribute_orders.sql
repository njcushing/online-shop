BEGIN;

CREATE TEMP TABLE product_attribute_orders_csv (
    product_slug text,
    product_attribute_name text,
    position int
);

COPY product_attribute_orders_csv (product_slug, product_attribute_name, position)
FROM '/db/seeds/data/product_attribute_orders.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO product_attribute_orders (product_id, product_attribute_id, position)
SELECT p.id, pa.id, pao.position
FROM product_attribute_orders_csv pao
JOIN products p ON p.slug = pao.product_slug
JOIN product_attributes pa ON pa.name = pao.product_attribute_name;

COMMIT;
