BEGIN;

INSERT INTO product_attribute_values
    (
        product_attribute_id,
        position,
        code,
        name,
        value_text,
        value_numeric,
        value_boolean,
        value_color,
        value_date,
        value_select
    )
VALUES
    ((SELECT id FROM product_attributes WHERE name='Size_Text'), 0,  'SM', 'Small',         'Small', NULL, NULL, NULL, NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Size_Text'), 1,  'MD', 'Medium',        'Medium', NULL, NULL, NULL, NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Size_Text'), 2,  'LG', 'Large',         'Large', NULL, NULL, NULL, NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     0,  'HO', 'House',         NULL, NULL, NULL, '#FFECDA', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     1,  'LT', 'Light',         NULL, NULL, NULL, '#E7A67A', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     2,  'MD', 'Medium',        NULL, NULL, NULL, '#945A38', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     3,  'DK', 'Dark',          NULL, NULL, NULL, '#523727', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     4,  'XD', 'Extra Dark',    NULL, NULL, NULL, '#251515', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     5,  'BK', 'Breakfast',     NULL, NULL, NULL, '#F6D6C3', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     6,  'PK', 'Pumpkin Spice', NULL, NULL, NULL, '#DDA774', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     7,  'MO', 'Mocha',         NULL, NULL, NULL, '#7C624A', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     8,  'ES', 'Espresso',      NULL, NULL, NULL, '#533B3A', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     9,  'VA', 'Vanilla',       NULL, NULL, NULL, '#AE8EC9', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     10, 'CA', 'Caramel',       NULL, NULL, NULL, '#E4AB60', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     11, 'IN', 'Intense',       NULL, NULL, NULL, '#F8DF8D', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     12, 'FR', 'French Roast',  NULL, NULL, NULL, '#9BDBD6', NULL, NULL),
    ((SELECT id FROM product_attributes WHERE name='Blend'),     13, 'IR', 'Italian Roast', NULL, NULL, NULL, '#89D687', NULL, NULL);

COMMIT;
