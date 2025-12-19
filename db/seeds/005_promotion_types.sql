BEGIN;

CREATE TEMP TABLE promotion_types_csv (
    name text
);

COPY promotion_types_csv (name)
FROM '/db/seeds/data/promotion_types.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO promotion_types (name)
SELECT *
FROM promotion_types_csv;

COMMIT;
