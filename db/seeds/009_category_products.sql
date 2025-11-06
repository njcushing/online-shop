BEGIN;

INSERT INTO category_products
    (category_id, product_id)
VALUES
    (
        (SELECT id FROM categories WHERE slug='beans'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g')
    ),
    (
        (SELECT id FROM categories WHERE slug='beans'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g')
    ),
    (
        (SELECT id FROM categories WHERE slug='beans'),
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg')
    );

COMMIT;
