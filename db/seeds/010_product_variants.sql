BEGIN;

INSERT INTO product_variants
    (
        product_id,
        name,
        sku,
        can_subscribe,
        price_current,
        price_base,
        subscription_discount_percentage,
        stock,
        allowance_override,
        active,
        release_date
    )
VALUES
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        'Coffee - Whole Bean - 250g - Light Blend',
        'COF-WB-250G-LT',
        true,
        550.00,
        700.00,
        10.0000,
        321,
        NULL,
        true,
        now()
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        'Coffee - Whole Bean - 250g - Medium Blend',
        'COF-WB-250G-MD',
        true,
        700.00,
        700.00,
        10.0000,
        40,
        NULL,
        true,
        now()
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-250g'),
        'Coffee - Whole Bean - 250g - Dark Blend',
        'COF-WB-250G-DK',
        true,
        700.00,
        700.00,
        15.0000,
        0,
        NULL,
        true,
        now()
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        'Coffee - Whole Bean - 500g - Light Blend',
        'COF-WB-500G-LT',
        false,
        1250.00,
        1250.00,
        0.0000,
        237,
        NULL,
        true,
        now()
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        'Coffee - Whole Bean - 500g - Medium Blend',
        'COF-WB-500G-MD',
        true,
        1100.00,
        1250.00,
        0.0000,
        123,
        NULL,
        true,
        now()
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-500g'),
        'Coffee - Whole Bean - 500g - Dark Blend',
        'COF-WB-500G-DK',
        true,
        1100.00,
        1250.00,
        10.0000,
        382,
        NULL,
        true,
        now()
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        'Coffee - Whole Bean - 1kg - Light Blend',
        'COF-WB-1KG-LT',
        false,
        1900.00,
        2250.00,
        0.0000,
        89,
        NULL,
        true,
        now()
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        'Coffee - Whole Bean - 1kg - Medium Blend',
        'COF-WB-1KG-MD',
        true,
        2250.00,
        2250.00,
        10.0000,
        76,
        NULL,
        true,
        now()
    ),
    (
        (SELECT id FROM products WHERE slug='coffee-whole-bean-1kg'),
        'Coffee - Whole Bean - 1kg - Dark Blend',
        'COF-WB-1KG-DK',
        true,
        1900.00,
        2250.00,
        20.0000,
        102,
        NULL,
        true,
        now()
    );

COMMIT;


