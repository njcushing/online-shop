-- migrate:up
ALTER TABLE products
ADD COLUMN search_text text;

CREATE OR REPLACE FUNCTION update_products_search_text()
RETURNS trigger AS $$
BEGIN
    NEW.search_text :=
        NEW.name || ' ' ||
        coalesce(array_to_string(NEW.tags, ' '), '') || ' ' ||
        coalesce(NEW.description, '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_search_text
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_products_search_text();

CREATE INDEX idx_products_fts
ON products
USING GIN (to_tsvector('english', search_text));

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_products_trgm
ON products
USING GIN (name gin_trgm_ops);

-- migrate:down
DROP INDEX IF EXISTS idx_products_trgm;
DROP INDEX IF EXISTS idx_products_fts;
DROP TRIGGER IF EXISTS trg_products_search_text ON products;
DROP FUNCTION IF EXISTS update_products_search_text();
ALTER TABLE products DROP COLUMN IF EXISTS search_text;
