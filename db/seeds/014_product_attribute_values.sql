BEGIN;

INSERT INTO product_attribute_values (product_attribute_id, code, name) VALUES
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'LT', 'Light'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'MD', 'Medium'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'DK', 'Dark');

COMMIT;
