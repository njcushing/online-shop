BEGIN;

INSERT INTO product_variant_attributes
    (product_id, product_variant_id, product_attribute_id, product_attribute_value_id)
VALUES
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'LT'))
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'MD'))
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-250G-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'DK'))
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'LT'))
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'MD'))
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-500G-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'DK'))
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-LT'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'LT'))
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-MD'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'MD'))
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        (SELECT id FROM product_variants WHERE sku='COF-WB-1KG-DK'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        (SELECT get_product_attribute_value_id('Blend', 'DK'))
    );

COMMIT;
