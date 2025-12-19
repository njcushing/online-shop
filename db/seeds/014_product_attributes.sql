BEGIN;

CREATE TEMP TABLE product_attributes_csv (
    name text,
    title text,
    product_attribute_value_type_name text
);

COPY product_attributes_csv (name, title, product_attribute_value_type_name)
FROM '/db/seeds/data/product_attributes.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO product_attributes (name, title, product_attribute_value_type_id)
SELECT pa.name, pa.title, pavt.id
FROM product_attributes_csv pa
JOIN product_attribute_value_types pavt ON pavt.name = pa.product_attribute_value_type_name;

COMMIT;
