-- migrate:up
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no text NOT NULL UNIQUE,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    order_status_type_id uuid NOT NULL REFERENCES order_status_types(id) ON DELETE RESTRICT,
    total numeric(10,2) NOT NULL,
    expected_date timestamptz,
    delivered_date timestamptz,
    tracking_no text UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS orders;
