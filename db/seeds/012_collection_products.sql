BEGIN;

INSERT INTO collection_products (collection_id, product_id, name, position) VALUES
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        '250g bag',
        0
    ),
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        '500g bag',
        1
    ),
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        '1kg bag',
        2
    );

COMMIT;
