BEGIN;

INSERT INTO collection_products (collection_id, product_id) VALUES
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g')
    ),
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g')
    ),
    (
        (SELECT id FROM collections WHERE slug='coffee-whole-bean'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg')
    );

COMMIT;
