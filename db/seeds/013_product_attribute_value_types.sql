BEGIN;

CREATE TEMP TABLE product_attribute_value_types_csv (
    name text
);

COPY product_attribute_value_types_csv (name)
FROM '/db/seeds/data/product_attribute_value_types.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO product_attribute_value_types (name)
SELECT *
FROM product_attribute_value_types_csv;

COMMIT;
