-- migrate:up
CREATE TABLE settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_express_delivery_cost numeric(10,2) NOT NULL,
    free_express_delivery_threshold numeric(10,2) NOT NULL,
    low_stock_threshold int NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- migrate:down
DROP TABLE IF EXISTS settings;
