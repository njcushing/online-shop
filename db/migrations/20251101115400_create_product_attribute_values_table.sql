-- migrate:up
CREATE TABLE product_attribute_values (
    product_attribute_id uuid NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    code text NOT NULL,
    name text NOT NULL,
    position int NOT NULL CHECK (position >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (product_attribute_id, code),
    UNIQUE (product_attribute_id, position)
);

-- migrate:down
DROP TABLE IF EXISTS product_attribute_values;
