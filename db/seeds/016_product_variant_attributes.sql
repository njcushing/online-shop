BEGIN;

INSERT INTO product_variant_attributes
    (product_variant_id, product_attribute_id, product_attribute_value_code)
VALUES
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='LT')
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='MD')
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='DK')
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='LT')
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='MD')
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='DK')
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='LT')
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='MD')
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT code FROM product_attribute_values WHERE code='DK')
    );

COMMIT;
