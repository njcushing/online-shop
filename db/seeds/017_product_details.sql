BEGIN;

INSERT INTO product_details (product_id, name, value) VALUES
    ((SELECT id FROM products WHERE slug='coffee-whole-bean-250g'), 'Weight', '250g'),
    ((SELECT id FROM products WHERE slug='coffee-whole-bean-500g'), 'Weight', '500g'),
    ((SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'), 'Weight', '1kg');

COMMIT;
