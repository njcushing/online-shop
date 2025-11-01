BEGIN;

INSERT INTO product_attribute_orders (product_id, product_attribute_id, position) VALUES
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        0
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        0
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        (SELECT id FROM product_attributes WHERE name='Blend'),
        0
    );

COMMIT;
