-- migrate:up
CREATE TABLE product_reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title text,
    description text NOT NULL,
    rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);

-- migrate:down
DROP TABLE IF EXISTS product_reviews;

