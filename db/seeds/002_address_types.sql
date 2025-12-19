BEGIN;

CREATE TEMP TABLE address_types_csv (
    name text
);

COPY address_types_csv (name)
FROM '/db/seeds/data/address_types.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO address_types (name)
SELECT *
FROM address_types_csv;

COMMIT;
