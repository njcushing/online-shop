BEGIN;

CREATE TEMP TABLE subscription_status_types_csv (
    name text
);

COPY subscription_status_types_csv (name)
FROM '/db/seeds/data/subscription_status_types.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO subscription_status_types (name)
SELECT *
FROM subscription_status_types_csv;

COMMIT;
