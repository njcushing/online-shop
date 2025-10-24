BEGIN;

INSERT INTO product_variant_attributes
    (product_variant_id, product_attribute_id, value)
VALUES
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'LT'
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'MD'
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'DK'
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'LT'
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'MD'
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'DK'
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'LT'
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'MD'
    ),
    (
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        'DK'
    );

COMMIT;
