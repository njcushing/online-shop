BEGIN;

INSERT INTO products
    (name, description, slug, allowance, active, release_date)
VALUES
    (
        'Coffee - Whole Bean - 250g',
        '',
        'coffee-whole-bean-250g',
        100,
        true,
        now()
    ),
    (
        'Coffee - Whole Bean - 500g',
        '',
        'coffee-whole-bean-500g',
        50,
        true,
        now()
    ),
    (
        'Coffee - Whole Bean - 1kg',
        '',
        'coffee-whole-bean-1kg',
        25,
        true,
        now()
    );

COMMIT;
