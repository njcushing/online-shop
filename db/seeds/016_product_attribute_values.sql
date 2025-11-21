BEGIN;

INSERT INTO product_attribute_values (product_attribute_id, code, name, position) VALUES
    ((SELECT id FROM product_attributes WHERE name='Size_Text'), 'SM', 'Small', 0),
    ((SELECT id FROM product_attributes WHERE name='Size_Text'), 'MD', 'Medium', 1),
    ((SELECT id FROM product_attributes WHERE name='Size_Text'), 'LG', 'Large', 2),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'HO', 'House', 0),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'LT', 'Light', 1),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'MD', 'Medium', 2),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'DK', 'Dark', 3),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'XD', 'Extra Dark', 4),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'BK', 'Breakfast', 5),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'PK', 'Pumpkin Spice', 6),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'MO', 'Mocha', 7),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'ES', 'Espresso', 8),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'VA', 'Vanilla', 9),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'CA', 'Caramel', 10),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'IN', 'Intense', 11),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'FR', 'French Roast', 12),
    ((SELECT id FROM product_attributes WHERE name='Blend'), 'IR', 'Italian Roast', 13);

COMMIT;
