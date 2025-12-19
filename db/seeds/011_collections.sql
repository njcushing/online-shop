BEGIN;

CREATE TEMP TABLE collections_csv (
    name text,
    title text,
    description text,
    slug text
);

COPY collections_csv (name, title, description, slug)
FROM '/db/seeds/data/collections.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO collections (name, title, description, slug)
SELECT *
FROM collections_csv;

COMMIT;
