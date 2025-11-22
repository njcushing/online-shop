BEGIN;

INSERT INTO category_product_attribute_filters (category_id, product_attribute_id) VALUES
    ((SELECT id FROM categories WHERE slug='beans'), (SELECT id FROM product_attributes WHERE name='Blend'));

COMMIT;
