-- migrate:up
CREATE TABLE product_ratings (
    product_id uuid PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    average numeric(3,2) NOT NULL DEFAULT 0,
    total integer NOT NULL DEFAULT 0,
    rating_5 integer NOT NULL DEFAULT 0,
    rating_4 integer NOT NULL DEFAULT 0,
    rating_3 integer NOT NULL DEFAULT 0,
    rating_2 integer NOT NULL DEFAULT 0,
    rating_1 integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE product_ratings
  SET
    average = (
      SELECT COALESCE(AVG(rating), 0) FROM product_reviews WHERE product_id = NEW.product_id
    ),
    total = (
      SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id
    ),
    rating_5 = (
      SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id AND rating = 5
    ),
    rating_4 = (
      SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id AND rating = 4
    ),
    rating_3 = (
      SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id AND rating = 3
    ),
    rating_2 = (
      SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id AND rating = 2
    ),
    rating_1 = (
      SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id AND rating = 1
    ),
    updated_at = now()
  WHERE product_id = NEW.product_id;

  INSERT INTO product_ratings (product_id)
  VALUES (NEW.product_id)
  ON CONFLICT (product_id) DO NOTHING;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_reviews_rating_update
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- migrate:down
DROP TRIGGER IF EXISTS product_reviews_rating_update ON product_reviews;
DROP FUNCTION IF EXISTS update_product_rating();
DROP TABLE IF EXISTS product_ratings;
