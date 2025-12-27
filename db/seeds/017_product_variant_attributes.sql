BEGIN;

CREATE TEMP TABLE product_variant_attributes_csv (
    product_slug text,
    product_variant_sku text,
    product_attribute_code text,
    product_attribute_value_code text
);

COPY product_variant_attributes_csv (product_slug, product_variant_sku, product_attribute_code, product_attribute_value_code)
FROM '/db/seeds/data/product_variant_attributes.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO product_variant_attributes (product_id, product_variant_id, product_attribute_id, product_attribute_value_id)
SELECT p.id, pv.id, pa.id, pav.id
FROM product_variant_attributes_csv pva
JOIN products p ON p.slug = pva.product_slug
JOIN product_variants pv ON pv.sku = pva.product_variant_sku
JOIN product_attributes pa ON pa.code = pva.product_attribute_code
JOIN product_attribute_values pav ON pav.code = pva.product_attribute_value_code
    AND pav.product_attribute_id = pa.id;

COMMIT;
