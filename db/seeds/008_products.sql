BEGIN;

CREATE TEMP TABLE products_csv (
    name text,
    description text,
    slug text,
    allowance int,
    active boolean,
    release_date timestamptz
);

COPY products_csv (name, description, slug, allowance, active, release_date)
FROM '/db/seeds/data/products.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO products (name, description, slug, allowance, active, release_date)
SELECT name, description, slug, allowance, active, release_date
FROM products_csv;

COMMIT;
