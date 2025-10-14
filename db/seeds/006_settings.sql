BEGIN;

INSERT INTO settings (base_express_delivery_cost, free_express_delivery_threshold) VALUES
    (5.99, 50.00);

COMMIT;
