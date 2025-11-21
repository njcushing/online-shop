BEGIN;

INSERT INTO product_attributes (name, title, product_attribute_value_type_id) VALUES
    ('Size_Text', 'Choose a size', (SELECT id FROM product_attribute_value_types WHERE name='text')),
    ('Blend', 'Choose a blend', (SELECT id FROM product_attribute_value_types WHERE name='color'));

COMMIT;
