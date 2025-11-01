BEGIN;

INSERT INTO product_attribute_values (product_attribute_id, code, name) VALUES
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'HO', 'House'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'LT', 'Light'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'MD', 'Medium'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'DK', 'Dark'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'XD', 'Extra Dark'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'BK', 'Breakfast'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'PK', 'Pumpkin Spice'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'MO', 'Mocha'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'ES', 'Espresso'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'VA', 'Vanilla'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'CA', 'Caramel'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'IN', 'Intense'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'FR', 'French Roast'),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'IR', 'Italian Roast');

COMMIT;
