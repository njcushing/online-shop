BEGIN;

INSERT INTO order_status_types (name) VALUES
    ('pending'),
    ('paid'),
    ('shipped'),
    ('delivered'),
    ('cancelled'),
    ('refunded'),
    ('returned');

COMMIT;
