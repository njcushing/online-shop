-- migrate:up
CREATE OR REPLACE FUNCTION create_product_rating_for_product()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO product_ratings (product_id)
  VALUES (NEW.id)
  ON CONFLICT (product_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_product_rating_exists
AFTER INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION create_product_rating_for_product();

-- migrate:down
DROP TRIGGER IF EXISTS ensure_product_rating_exists ON products;
DROP FUNCTION IF EXISTS create_product_rating_for_product();
