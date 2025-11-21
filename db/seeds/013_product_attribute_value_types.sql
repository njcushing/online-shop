BEGIN;

INSERT INTO product_attribute_value_types (name) VALUES
    ('text'),
    ('numeric'),
    ('boolean'),
    ('color'),
    ('date'),
    ('select');

COMMIT;
