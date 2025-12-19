BEGIN;

CREATE TEMP TABLE categories_csv (
    parent_slug text,
    name text,
    slug text,
    description text
);

COPY categories_csv (parent_slug, name, slug, description)
FROM '/db/seeds/data/categories.csv'
WITH (FORMAT csv, HEADER true);

-- Insert root categories
INSERT INTO categories (parent_id, name, slug, description)
SELECT NULL, c.name, c.slug, c.description
FROM categories_csv c
WHERE c.parent_slug IS NULL;

-- Insert subcategories
INSERT INTO categories (parent_id, name, slug, description)
SELECT pc.id, c.name, c.slug, c.description
FROM categories_csv c
JOIN categories pc ON pc.slug = c.parent_slug;

COMMIT;
