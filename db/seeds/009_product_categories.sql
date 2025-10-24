BEGIN;

INSERT INTO product_categories
    (product_id, category_id)
VALUES
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        (SELECT id FROM categories WHERE slug='beans')
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        (SELECT id FROM categories WHERE slug='beans')
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        (SELECT id FROM categories WHERE slug='beans')
    );

COMMIT;
