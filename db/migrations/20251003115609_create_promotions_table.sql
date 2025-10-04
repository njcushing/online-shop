-- migrate:up
CREATE TABLE promotions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    promotion_type_id uuid NOT NULL REFERENCES promotion_types(id) ON DELETE RESTRICT,
    discount_value numeric(10,4) NOT NULL,
    threshold_value numeric(10,2) NOT NULL DEFAULT 0,
    start_date timestamptz NOT NULL,
    end_date timestamptz,
    active boolean NOT NULL,
    usage_limit int,
    times_used int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    CHECK (end_date IS NULL OR end_date > start_date)
);

-- migrate:down
DROP TABLE IF EXISTS promotions;
