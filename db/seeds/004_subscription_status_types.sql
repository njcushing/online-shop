BEGIN;

INSERT INTO subscription_status_types (name) VALUES
    ('active'),
    ('paused'),
    ('cancelled'),
    ('inactive');

COMMIT;
