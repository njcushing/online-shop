BEGIN;

INSERT INTO promotions
    (code, name, description, promotion_type_id, discount_value, threshold_value, start_date, active, usage_limit)
VALUES
    (
        'ADMIN_FIXED',
        'Test code',
        'This code is for testing purposes.',
        (SELECT id FROM promotion_types WHERE name='fixed'),
        10.0000,
        0.00,
        now(),
        true,
        -1
    ),
    (
        'ADMIN_PERCENTAGE',
        'Test code',
        'This code is for testing purposes.',
        (SELECT id FROM promotion_types WHERE name='percentage'),
        10.0000,
        0.00,
        now(),
        true,
        -1
    );

COMMIT;
