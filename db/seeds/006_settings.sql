BEGIN;

CREATE TEMP TABLE settings_csv (
    base_express_delivery_cost numeric(10,2),
    free_express_delivery_threshold numeric(10,2),
    low_stock_threshold int
);

COPY settings_csv (base_express_delivery_cost, free_express_delivery_threshold, low_stock_threshold)
FROM '/db/seeds/data/settings.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO settings (base_express_delivery_cost, free_express_delivery_threshold, low_stock_threshold)
SELECT *
FROM settings_csv;

COMMIT;
