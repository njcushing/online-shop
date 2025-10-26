BEGIN;

INSERT INTO collection_products (collection_id, product_id, name) VALUES
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        '250g bag'
    ),
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        '500g bag'
    ),
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        '1kg bag'
    );

COMMIT;
