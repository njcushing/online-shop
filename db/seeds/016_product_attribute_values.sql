BEGIN;

CREATE TEMP TABLE product_attribute_values_csv (
    product_attribute_code text,
    position int,
    code text,
    name text,
    value_text text,
    value_numeric numeric,
    value_boolean boolean,
    value_color text,
    value_date timestamptz,
    value_select text
);

COPY product_attribute_values_csv (
    product_attribute_code,
    position,
    code,
    name,
    value_text,
    value_numeric,
    value_boolean,
    value_color,
    value_date,
    value_select
)
FROM '/db/seeds/data/product_attribute_values.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO product_attribute_values (
    product_attribute_id,
    position,
    code,
    name,
    value_text,
    value_numeric,
    value_boolean,
    value_color,
    value_date,
    value_select
)
SELECT
    pa.id,
    pav.position,
    pav.code,
    pav.name,
    pav.value_text,
    pav.value_numeric,
    pav.value_boolean,
    pav.value_color,
    pav.value_date,
    pav.value_select
FROM product_attribute_values_csv pav
JOIN product_attributes pa ON pa.code = pav.product_attribute_code;

COMMIT;
