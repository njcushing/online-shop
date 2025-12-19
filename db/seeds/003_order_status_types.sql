BEGIN;

CREATE TEMP TABLE order_status_types_csv (
    name text
);

COPY order_status_types_csv (name)
FROM '/db/seeds/data/order_status_types.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO order_status_types (name)
SELECT *
FROM order_status_types_csv;

COMMIT;
