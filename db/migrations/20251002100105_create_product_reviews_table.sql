-- migrate:up
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);

-- migrate:down
DROP TABLE IF EXISTS product_reviews;

