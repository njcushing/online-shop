-- migrate:up
CREATE TABLE product_reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id uuid,
    title text,
    description text NOT NULL,
    rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT fk_product_variant_matches_product
        FOREIGN KEY (product_variant_id, product_id)
        REFERENCES product_variants (id, product_id) ON DELETE SET NULL

);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);

-- migrate:down
DROP TABLE IF EXISTS product_reviews;

