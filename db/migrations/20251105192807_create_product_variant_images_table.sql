-- migrate:up
CREATE TABLE product_variant_images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    src text NOT NULL,
    alt text NOT NULL,
    position int NOT NULL CHECK (position >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE (product_variant_id, position)
);

-- migrate:down
DROP TABLE IF EXISTS product_variant_images;
